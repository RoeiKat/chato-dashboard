export default function AppCard({ app, onCopy, onDelete }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex items-start justify-between gap-3">
      <div>
        <div className="text-lg font-semibold">{app.name}</div>
        <div className="text-xs text-zinc-400 mt-1 break-all">
          apiKey: <span className="text-zinc-200">{app.apiKey}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="px-2 py-1 rounded-full text-xs border border-zinc-700">
          Unread: <span className="font-semibold">{app.unread || 0}</span>
        </div>

        <div className="flex gap-2">
          <button className="text-xs underline text-zinc-300" onClick={() => onCopy(app.apiKey)}>
            Copy
          </button>
          <button
            className="text-xs underline text-red-400"
            onClick={() => onDelete(app)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
