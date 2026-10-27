# a0-betatest — deprecated A0 work

**Deprecated at the owner's request. Retained for historical inspection and reproducibility.** New A0 development and deployment are retired; no replacement A0 runtime is declared.

## Preserved source

The existing archival change moved the complete previous source tree under [archive/](archive/) without changing its contents. This notice leaves that tree intact.

| Evidence | Exact identity |
| --- | --- |
| Source commit before relocation | `d4cc65f2c2df066490f119bc36368b5d195c08ff` |
| Preserved source / archive tree | `a52bcb513aed724732fdce822a8a82c8ac88ecdc` |
| Archival relocation commit | `afeae6519d0e99d8f8ad0ab8015f284cd9c071b8` |
| Preserved tracked files | 1306 |

The public-gonol source fixture and its provenance remain preserved. Its historical origin is commit `7af8debf6ef3905f01baff02b43d8c3bee16ccbc`, path `backend/interdependent_lib/gonal/gonal.py`. Retirement of the A0 application does not retire independent consumers or transfer mathematical authority.

## Usage

Read [the historical README](archive/README.md) as historical documentation. Preserve the licenses and notices within each source tree. For exact historical analysis, check out the source commit above into an isolated worktree; do not use the old deployment or startup instructions against a live environment.

Verify preservation from a fetched clone:

```sh
git rev-parse d4cc65f2c2df066490f119bc36368b5d195c08ff^{tree}
git rev-parse HEAD:archive
```

Both results must equal the preserved tree identity above. Existing commit-pinned references remain historical source references; current-branch consumers must use the preserved path or an explicitly chosen historical commit.

## Retirement boundary

A source archive, GitHub's read-only repository archive flag, and hosted runtime shutdown are separate states. This documentation records source preservation and deprecation only. Database contents, runtime uploads, private checkpoints, credentials, and hosted configuration are outside the tracked-source preservation claim. Keep independent research repositories, shared hosts, and their dependencies intact.

**hmmm:** GitHub archive-flag verification and provider-level runtime/data-retention receipts must be recorded separately before complete operational retirement is claimed.
