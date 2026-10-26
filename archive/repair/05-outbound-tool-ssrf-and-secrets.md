# Repair 05 — Outbound tool SSRF and secret storage

**Priority:** P0  
**Status:** open  
**Primary risk:** authenticated users can register webhook destinations that reach loopback, private networks, or cloud metadata; webhook secrets are stored in plaintext.

## Verified current behavior

- Webhook registration checks only that a URL begins with `http://` or `https://`.
- Invocation uses `httpx.AsyncClient(..., follow_redirects=True)` and does not validate the initial or redirected destination.
- The dispatcher reads the complete response before truncating returned text.
- `webhook_secret` is stored directly in Mongo and hydrated into the process registry.
- Other URL-bearing integrations—MCP and Odysseus—must be reviewed under the same outbound-network policy.

## Objective

Create one reusable outbound-request boundary that blocks server-side request forgery, controls redirects and response size, and encrypts integration credentials at rest.

## Required changes

1. Introduce a shared `SafeOutboundURL` validator used by webhook, MCP, Odysseus, and future user-configured network adapters.
2. Require HTTPS by default. Permit HTTP only under an explicit local-development setting that cannot be enabled in production accidentally.
3. Resolve hostnames and reject all non-public destinations, including:
   - loopback;
   - RFC1918/private ranges;
   - link-local;
   - carrier-grade NAT;
   - multicast and reserved ranges;
   - IPv6 loopback, unique-local, link-local, mapped-private addresses;
   - cloud metadata hostnames and addresses.
4. Defend against DNS rebinding:
   - validate every resolved address;
   - connect to a validated address or revalidate immediately before connection;
   - reject address changes into forbidden ranges.
5. Disable automatic redirects or validate each redirect hop with a strict hop limit.
6. Stream responses and enforce byte limits before buffering. Set separate connect, read, write, and total timeouts.
7. Restrict methods, headers, and content types to the adapter’s declared contract.
8. Encrypt webhook secrets, MCP tokens, and Odysseus credentials using a versioned vault abstraction. Never place plaintext secrets in list responses, logs, exceptions, audit payloads, or in-memory global registries longer than needed.
9. Support secret rotation without requiring destructive tool recreation.
10. Add outbound request telemetry containing destination class and status, but no credentials or sensitive body content.

## Required tests

- Registration or invocation rejects `localhost`, `127.0.0.1`, `::1`, private IPv4/IPv6, link-local, and metadata endpoints.
- A public URL redirecting to a private address is rejected.
- DNS answers containing any forbidden address are rejected.
- Oversized or indefinitely streaming responses are terminated at the configured limit.
- Stored database records do not contain the plaintext secret.
- Error messages and audit events do not expose signatures, tokens, or request bodies.
- A valid public HTTPS webhook still receives a correct HMAC signature.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Use mocked DNS and HTTP transports; do not make real metadata or private-network requests in tests.

## Likely touchpoints

- `backend/api_tools_mcp_skills.py`
- `backend/tools/webhook.py`
- MCP and Odysseus client adapters
- `backend/crypto_vault.py`
- integration schemas and migrations

## Out of scope

Tenant-safe tool resolution belongs to Repair 04.

## hmmm

A registration-time URL check is insufficient because DNS and redirects are runtime facts. The final connected address—not merely the submitted hostname—must satisfy the boundary.