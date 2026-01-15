import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { openCreateApp } from "../store/uiSlice";
import { fetchAppsThunk, setAppUnread, deleteAppThunk } from "../store/appsSlice";
import CreateAppModal from "../components/CreateAppModal";
import AppCard from "../components/AppCard";
import { subscribeAppSessions } from "../firebase/listeners";


export default function DashboardPage() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const apps = useSelector((s) => s.apps.items);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAppsThunk({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    if (!apps || apps.length === 0) return;

    const unsubs = apps.map((app) =>
      subscribeAppSessions(app.apiKey, ({ unread }) => {
        dispatch(setAppUnread({ apiKey: app.apiKey, unread }));
      })
    );

    return () => {
      unsubs.forEach((u) => u && u());
    };
  }, [apps, dispatch]);

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
  };

    const onDelete = (app) => {
    const ok = window.confirm(
      `Delete "${app.name}"?\n\nThis will permanently delete:\n- the API key\n- sessions\n- messages\n\nThis cannot be undone.`
    );
    if (!ok) return;

    dispatch(deleteAppThunk({ token, apiKey: app.apiKey }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-900">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <div>
            <div className="text-xl font-semibold">Dashboard</div>
            <div className="text-sm text-zinc-400">Apps (API keys) & notifications</div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-medium"
              onClick={() => dispatch(openCreateApp())}
            >
              + Create App
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-zinc-700"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        {apps.length === 0 ? (
          <div className="mt-10 text-zinc-400">
            No apps yet. Click <span className="text-zinc-200 font-semibold">Create App</span> to generate your first API key.
          </div>
        ) : (
          <div className="grid gap-3">
            {apps.map((app) => (
              <AppCard key={app.apiKey} app={app} onCopy={copy} onDelete={onDelete} />
            ))}
          </div>
        )}
      </main>

      <CreateAppModal />
    </div>
  );
}
