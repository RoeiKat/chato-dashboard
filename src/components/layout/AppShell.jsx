import { useState } from "react";
import { cloneElement, isValidElement } from "react";

function HamburgerIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AppShell({ sidebar, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarNode =
    isValidElement(sidebar)
      ? cloneElement(sidebar, { mobileOpen, setMobileOpen })
      : null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="flex min-h-screen">
        {sidebarNode}

        <main className="flex-1">
          {/* Mobile top bar */}
          <div className="sm:hidden sticky top-0 z-40 bg-[var(--bg)] border-b border-[var(--border)]">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                className="w-10 h-10 rounded-xl bg-[var(--panel)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--soft)] cursor-pointer"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <HamburgerIcon className="text-[var(--ink)]" />
              </button>

              <div className="font-semibold">Chato</div>
              <div className="w-10 h-10" />
            </div>
          </div>

          <div className="p-4 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
