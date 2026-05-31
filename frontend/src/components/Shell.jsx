import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Atom, KeyReturn, Brain, Cards, Vault, FileText, Pulse, Lightning, Coin } from "@phosphor-icons/react";

const items = [
  { to: "/", label: "Workspace",   icon: <Brain size={18} />, testid: "nav-workspace" },
  { to: "/inventory", label: "Inventory", icon: <Cards size={18} />, testid: "nav-inventory" },
  { to: "/keys",  label: "Key Vault",   icon: <KeyReturn size={18} />, testid: "nav-keys" },
  { to: "/vault", label: "Env Vault",   icon: <Vault size={18} />, testid: "nav-vault" },
  { to: "/drafts",label: "Drafts",      icon: <FileText size={18} />, testid: "nav-drafts" },
  { to: "/inspector", label: "Inspector",icon: <Pulse size={18} />, testid: "nav-inspector" },
  { to: "/agents",label: "Agents",      icon: <Lightning size={18} />, testid: "nav-agents" },
];

export default function Shell({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r border-white/10 bg-bg-panel flex flex-col">
        <Link to="/" className="px-4 py-5 border-b border-white/10 flex items-center gap-3 hover:bg-bg-surface transition-colors" data-testid="brand-home">
          <Atom size={26} weight="duotone" className="text-accent-cyan" />
          <div>
            <div className="font-mono text-base tracking-tight text-white">a0p</div>
            <div className="text-[0.65rem] tracking-ultra uppercase text-neutral-500">research instrument</div>
          </div>
        </Link>

        <nav className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible py-2 md:py-3">
          {items.map(it => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/"}
              data-testid={it.testid}
              className={({ isActive }) =>
                "flex items-center gap-3 px-4 py-2.5 font-mono text-xs uppercase tracking-ultra border-l-2 transition-colors " +
                (isActive
                  ? "text-accent-cyan border-accent-cyan bg-bg-surface"
                  : "text-neutral-400 border-transparent hover:text-white hover:bg-bg-surface")
              }
            >
              {it.icon} <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <a href="#donate" data-testid="donate-cta"
             className="flex items-start gap-2 p-3 border border-accent-amber/30 hover:border-accent-amber/80 transition-colors">
            <Coin size={20} className="text-accent-amber mt-0.5" />
            <div>
              <div className="font-mono text-[0.7rem] tracking-ultra uppercase text-accent-amber">support this</div>
              <div className="text-[0.7rem] text-neutral-400 mt-1 font-sans">
                research instrument · donation-funded.
                $5 min — no perks unlocked, no paywall ever.
              </div>
            </div>
          </a>
          <div className="mt-3 text-[0.6rem] font-mono text-neutral-600 tracking-wider">
            v0.1 · interdependent-lib
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
