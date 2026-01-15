import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateApp } from "../store/uiSlice";
import { createAppThunk } from "../store/appsSlice";

export default function CreateAppModal() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.createAppOpen);
  const token = useSelector((s) => s.auth.token);
  const [name, setName] = useState("");

  if (!open) return null;

  const create = async () => {
    if (!name.trim()) return;
    await dispatch(createAppThunk({ token, name: name.trim() }));
    setName("");
    dispatch(closeCreateApp());
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-lg font-semibold">Create API Key (App)</h3>
        <p className="text-sm text-zinc-400 mt-1">
          Give it a name so you can differentiate apps.
        </p>

        <input
          className="mt-4 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 outline-none focus:border-zinc-600"
          placeholder="e.g. My Android App"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-4 flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-xl border border-zinc-700"
            onClick={() => dispatch(closeCreateApp())}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-medium"
            onClick={create}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
