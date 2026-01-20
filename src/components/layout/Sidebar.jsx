function cx(...c) {
  return c.filter(Boolean).join(" ");
}

const ChatsIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 5.5C4 4.12 5.12 3 6.5 3h11C18.88 3 20 4.12 20 5.5v7c0 1.38-1.12 2.5-2.5 2.5H10l-4.2 3.15c-.7.53-1.8.03-1.8-.86V15C4 14.45 4 6.05 4 5.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const DashboardIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      opacity="0.1"
      d="M8.976 3C4.05476 3 3 4.05476 3 8.976V15.024C3 19.9452 4.05476 21 8.976 21H9V9H21V8.976C21 4.05476 19.9452 3 15.024 3H8.976Z"
      fill="currentColor"
    />
    <path
      d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M21 9L3 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 21L9 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AppsIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="24" height="24" fill="none" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5 13C18.1814 13 18.7678 12.9988 19.2443 13.0473C19.7375 13.0974 20.2228 13.209 20.6667 13.5056C20.9943 13.7245 21.2755 14.0057 21.4944 14.3333C21.791 14.7772 21.9026 15.2625 21.9527 15.7557C22.0001 16.2209 22 16.7907 22 17.4514C22 18.0483 22.0132 18.6497 21.9527 19.2443C21.9026 19.7375 21.791 20.2228 21.4944 20.6667C21.2755 20.9943 20.9943 21.2755 20.6667 21.4944C20.2228 21.791 19.7375 21.9026 19.2443 21.9527C18.7791 22.0001 18.2093 22 17.5486 22C16.9517 22 16.3503 22.0132 15.7557 21.9527C15.2625 21.9026 14.7772 21.791 14.3333 21.4944C14.0057 21.2755 13.7245 20.9943 13.5056 20.6667C13.209 20.2228 13.0974 19.7375 13.0473 19.2443C12.9988 18.7678 13 18.1814 13 17.5C13 16.8186 12.9988 16.2322 13.0473 15.7557C13.0974 15.2625 13.209 14.7772 13.5056 14.3333C13.7245 14.0057 14.0057 13.7245 14.3333 13.5056C14.7772 13.209 15.2625 13.0974 15.7557 13.0473C16.2322 12.9988 16.8186 13 17.5 13Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 13C7.18141 13 7.76776 12.9988 8.24428 13.0473C8.73752 13.0974 9.22279 13.209 9.66671 13.5056C9.99428 13.7245 10.2755 14.0057 10.4944 14.3333C10.791 14.7772 10.9026 15.2625 10.9527 15.7557C11.0001 16.2209 11 16.7907 11 17.4514C11 18.0483 11.0132 18.6497 10.9527 19.2443C10.9026 19.7375 10.791 20.2228 10.4944 20.6667C10.2755 20.9943 9.99428 21.2755 9.66671 21.4944C9.22279 21.791 8.73752 21.9026 8.24428 21.9527C7.77912 22.0001 7.20932 22 6.54857 22C5.95171 22 5.35034 22.0132 4.75572 21.9527C4.26248 21.9026 3.77721 21.791 3.33329 21.4944C3.00572 21.2755 2.72447 20.9943 2.50559 20.6667C2.20898 20.2228 2.09745 19.7375 2.04727 19.2443C1.99879 18.7678 2 18.1814 2 17.5C2 16.8186 1.99879 16.2322 2.04727 15.7557C2.09745 15.2625 2.20898 14.7772 2.50559 14.3333C2.72447 14.0057 3.00572 13.7245 3.33329 13.5056C3.77721 13.209 4.26248 13.0974 4.75572 13.0473C5.23225 12.9988 5.81858 13 6.5 13Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 2C7.18141 2 7.76776 1.99879 8.24428 2.04727C8.73752 2.09745 9.22279 2.20898 9.66671 2.50559C9.99428 2.72447 10.2755 3.00572 10.4944 3.33329C10.791 3.77721 10.9026 4.26248 10.9527 4.75572C11.0001 5.22089 11 5.79069 11 6.45143C11 7.04829 11.0132 7.64966 10.9527 8.24428C10.9026 8.73752 10.791 9.22279 10.4944 9.66671C10.2755 9.99428 9.99428 10.2755 9.66671 10.4944C9.22279 10.791 8.73752 10.9026 8.24428 10.9527C7.77912 11.0001 7.20932 11 6.54857 11C5.95171 11 5.35034 11.0132 4.75572 10.9527C4.26248 10.9026 3.77721 10.791 3.33329 10.4944C3.00572 10.2755 2.72447 9.99428 2.50559 9.66671C2.20898 9.22279 2.09745 8.73752 2.04727 8.24428C1.99879 7.76776 2 7.18142 2 6.5C2 5.81858 1.99879 5.23225 2.04727 4.75572C2.09745 4.26248 2.20898 3.77721 2.50559 3.33329C2.72447 3.00572 3.00572 2.72447 3.33329 2.50559C3.77721 2.20898 4.26248 2.09745 4.75572 2.04727C5.23225 1.99879 5.81858 2 6.5 2Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.5 3C18.5 2.44772 18.0523 2 17.5 2C16.9477 2 16.5 2.44772 16.5 3V5.5H14C13.4477 5.5 13 5.94772 13 6.5C13 7.05228 13.4477 7.5 14 7.5H16.5V10C16.5 10.5523 16.9477 11 17.5 11C18.0523 11 18.5 10.5523 18.5 10V7.5H21C21.5523 7.5 22 7.05228 22 6.5C22 5.94772 21.5523 5.5 21 5.5H18.5V3Z"
      fill="currentColor"
    />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M21 12L13 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function RowButton({ active, label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "w-full text-left px-3 py-2 rounded-xl text-sm transition flex items-center gap-3 cursor-pointer",
        active
          ? "bg-[var(--primary)] text-[var(--ink)] shadow-sm"
          : "text-[var(--ink)] hover:bg-[var(--soft)]"
      )}
    >
      <span className="w-5 h-5 text-[var(--ink)]">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Sidebar({
  activeTab,
  onChangeTab,
  mobileOpen = false,
  setMobileOpen,
  onLogoutClick,
}) {
  const closeMobile = () => setMobileOpen?.(false);
  const isDrawerOpen = Boolean(mobileOpen);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cx(
          "sm:hidden fixed inset-0 bg-black/30 z-40 transition-opacity",
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeMobile}
      />

      {/* One sidebar element: desktop static, mobile drawer */}
      <aside
        className={cx(
          "fixed sm:static inset-y-0 left-0 z-50 sm:z-auto",
          "w-[280px] shrink-0 bg-[var(--panel)] border-r border-[var(--border)]",
          "transition-transform",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-[var(--border)]">
          <div className="text-lg font-semibold tracking-tight text-[var(--ink)]">
            Chato
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">Dashboard</div>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-88px)]">
          <div>
            <div className="mb-3 px-2 text-[11px] uppercase tracking-wider text-[var(--muted)]">
              Menu
            </div>

            <div className="space-y-2">
              <RowButton
                label="Dashboard"
                active={activeTab === "dashboard"}
                icon={<DashboardIcon className="w-5 h-5" />}
                onClick={() => {
                  onChangeTab("dashboard");
                  closeMobile();
                }}
              />
              <RowButton
                label="Apps"
                active={activeTab === "apps"}
                icon={<AppsIcon className="w-5 h-5" />}
                onClick={() => {
                  onChangeTab("apps");
                  closeMobile();
                }}
              />
              
              <RowButton
  label="Chats"
  active={activeTab === "chats"}
  icon={<ChatsIcon className="w-5 h-5" />}
  onClick={() => {
    onChangeTab("chats");
    closeMobile();
  }}
/>

            </div>
          </div>

          {/* General section label + logout button */}
          <div className="mt-6">
            <div className="mb-3 px-2 text-[11px] uppercase tracking-wider text-[var(--muted)]">
              General
            </div>

            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[var(--ink)] hover:bg-[var(--soft)] cursor-pointer"
              onClick={() => {
                onLogoutClick?.();
                closeMobile();
              }}
            >
              <LogoutIcon className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="mt-auto" />
        </div>
      </aside>
    </>
  );
}
