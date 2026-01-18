import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppShell from "../components/layout/AppShell";
import Sidebar from "../components/layout/Sidebar";

import DashboardTab from "../components/dashboard/DashboardTab";
import AppsTab from "../components/apps/AppsTab";

import CreateAppModal from "../components/CreateAppModal";
import DeleteAppModal from "../components/DeleteAppModal";
import LogoutConfirmModal
 from "../components/LogoutConfrimModal";

import { logout } from "../store/authSlice";
import { openCreateApp } from "../store/uiSlice";
import { fetchAppsThunk, setAppRealtimeMeta, deleteAppThunk } from "../store/appsSlice";
import { subscribeAppSessions } from "../firebase/listeners";
import { ensureFirebaseAnonAuth } from "../firebase/webAuth";


export default function DashboardPage() {
  const dispatch = useDispatch();



  const token = useSelector((s) => s.auth.token);
  const apps = useSelector((s) => s.apps.items || []);

  const [tab, setTab] = useState("dashboard"); // dashboard | apps

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  // Logout modal
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAppsThunk({ token }));
  }, [dispatch, token]);

useEffect(() => {
  if (!apps?.length) return;

  let stopped = false;
  let unsubs = [];

  (async () => {
    await ensureFirebaseAnonAuth();
    if (stopped) return;

    unsubs = apps.map((app) =>
      subscribeAppSessions(app.apiKey, ({ unread, sessionsCount, activeCount }) => {
        dispatch(
          setAppRealtimeMeta({
            apiKey: app.apiKey,
            unread,
            sessionsCount,
            activeCount,
          })
        );
      })
    );
  })().catch((e) => console.error("Dashboard realtime subscribe failed:", e));

  return () => {
    stopped = true;
    unsubs.forEach((u) => u && u());
  };
}, [apps, dispatch]);



  const unreadTotal = useMemo(
    () => apps.reduce((sum, a) => sum + (a.unread || 0), 0),
    [apps]
  );

  const onCopy = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const requestDelete = (app) => {
    setPendingDelete(app);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    dispatch(deleteAppThunk({ token, apiKey: pendingDelete.apiKey }));
    setDeleteOpen(false);
    setPendingDelete(null);
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setPendingDelete(null);
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          activeTab={tab}
          onChangeTab={setTab}
          onLogoutClick={() => setLogoutOpen(true)}
        />
      }
    >
      {tab === "dashboard" && (
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-2xl font-semibold text-[var(--ink)]">
                Dashboard
              </div>
              <div className="text-sm text-[var(--muted)]">General overview</div>
            </div>

            <button
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold shadow-sm hover:brightness-95 cursor-pointer"
              onClick={() => dispatch(openCreateApp())}
            >
              + Create App
            </button>
          </div>

          <DashboardTab appsCount={apps.length} unreadTotal={unreadTotal} />
        </div>
      )}

      {tab === "apps" && (
        <AppsTab
          apps={apps}
          onCopy={onCopy}
          onDelete={requestDelete}
          onCreate={() => dispatch(openCreateApp())}
        />
      )}

      <CreateAppModal />

      <DeleteAppModal
        open={deleteOpen}
        appName={pendingDelete?.name || ""}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => dispatch(logout())}
      />
    </AppShell>
  );
}
