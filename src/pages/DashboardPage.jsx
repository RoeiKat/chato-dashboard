import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppShell from "../components/layout/AppShell";
import Sidebar from "../components/layout/Sidebar";

import DashboardTab from "../components/dashboard/DashboardTab";
import AppsConfigTab from "../components/apps/AppsConfigTab";
import ChatsTab from "../components/chats/ChatsTab";

import CreateAppModal from "../components/CreateAppModal";
import DeleteAppModal from "../components/DeleteAppModal";
import LogoutConfirmModal from "../components/LogoutConfrimModal";

import { logout } from "../store/authSlice";
import { openCreateApp } from "../store/uiSlice";
import { fetchAppsThunk, setAppRealtimeMeta, deleteAppThunk } from "../store/appsSlice";

import { subscribeAppSessions } from "../firebase/listeners";
import { ensureFirebaseAnonAuth } from "../firebase/webAuth";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const token = useSelector((s) => s.auth.token);
  const apps = useSelector((s) => s.apps.items || []);

  const [tab, setTab] = useState("dashboard"); // dashboard | chats | apps

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const [logoutOpen, setLogoutOpen] = useState(false);

  const appsStatus = useSelector((s) => s.apps.status);
  const appsError = useSelector((s) => s.apps.error);

  
useEffect(() => {
  if (!token) return;
  if (appsStatus !== "idle" && appsStatus !== "failed") return;
  dispatch(fetchAppsThunk({ token }));
}, [dispatch, token, appsStatus]);


  const apiKeysKey = useMemo(() => {
    if (!apps?.length) return "";
    return apps
      .map((a) => a.apiKey)
      .filter(Boolean)
      .sort()
      .join("|");
  }, [apps]);

  useEffect(() => {
    if (!apiKeysKey) return;

    let stopped = false;
    let unsubs = [];

    (async () => {
      await ensureFirebaseAnonAuth();
      if (stopped) return;

      const apiKeys = apiKeysKey.split("|").filter(Boolean);

      unsubs = apiKeys.map((apiKey) =>
        subscribeAppSessions(apiKey, ({ unread, sessionsCount, activeCount, messagesByDay }) => {
          dispatch(
            setAppRealtimeMeta({
              apiKey,
              unread,
              sessionsCount,
              activeCount,
              messagesByDay,
            })
          );
        })
      );
    })().catch((e) => console.error("Dashboard realtime subscribe failed:", e));

    return () => {
      stopped = true;
      unsubs.forEach((u) => u && u());
    };
  }, [apiKeysKey, dispatch]);

  const unreadTotal = useMemo(
    () => apps.reduce((sum, a) => sum + (a.unread || 0), 0),
    [apps]
  );

  const sessionsTotal = useMemo(
    () => apps.reduce((sum, a) => sum + (a.sessionsCount || 0), 0),
    [apps]
  );

  const activeTotal = useMemo(
    () => apps.reduce((sum, a) => sum + (a.activeCount || 0), 0),
    [apps]
  );

  const weekCounts = useMemo(() => {
    const out = [0, 0, 0, 0, 0, 0, 0];
    for (const a of apps) {
      const arr = a.messagesByDay;
      if (!Array.isArray(arr) || arr.length !== 7) continue;
      for (let i = 0; i < 7; i++) out[i] += Number(arr[i] || 0);
    }
    return out;
  }, [apps]);

  const weekLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const today = new Date();
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(fmt.format(d));
    }
    return labels;
  }, []);

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

  if (token && (appsStatus === "idle" || appsStatus === "loading")) {
  return (
    <div className="min-h-screen grid place-items-center bg-white overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <div className="h-24 w-24 rounded-full border-[14px] border-zinc-200 border-t-[#FFE95C] animate-spin" />
        <div className="text-sm text-zinc-600">Loading dashboard…</div>
      </div>
    </div>
  );
}

if (token && appsStatus === "failed") {
  return (
    <div className="min-h-screen grid place-items-center bg-white overflow-hidden">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="text-sm text-zinc-700">Couldn’t load dashboard data.</div>
        <div className="text-xs text-zinc-500">
          {appsError || "Server might be waking up (Render cold start)."}
        </div>

        <button
          className="mt-2 px-4 py-2 rounded-xl bg-[#FFE95C] text-black font-medium hover:opacity-90"
          onClick={() => dispatch(fetchAppsThunk({ token }))}
        >
          Retry
        </button>
      </div>
    </div>
  );
}



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
              <div className="text-2xl font-semibold text-[var(--ink)]">Dashboard</div>
              <div className="text-sm text-[var(--muted)]">General overview</div>
            </div>

            <button
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--ink)] font-semibold shadow-sm hover:brightness-95 cursor-pointer"
              onClick={() => dispatch(openCreateApp())}
            >
              + Create App
            </button>
          </div>

          <DashboardTab
            appsCount={apps.length}
            unreadTotal={unreadTotal}
            activeTotal={activeTotal}
            sessionsTotal={sessionsTotal}
            weekLabels={weekLabels}
            weekCounts={weekCounts}
          />
        </div>
      )}

      {tab === "apps" && (
        <AppsConfigTab
          apps={apps}
          onCopy={onCopy}
          onDelete={requestDelete}
          onCreate={() => dispatch(openCreateApp())}
        />
      )}

      {tab === "chats" && (
        <ChatsTab apps={apps} onOpenCreate={() => dispatch(openCreateApp())} />
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
