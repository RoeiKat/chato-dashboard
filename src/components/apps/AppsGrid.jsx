import AppCard from "./AppCard";

export default function AppsGrid({ apps = [], onCopy, onDelete, onOpenSettings }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app) => (
        <AppCard
          key={app.apiKey}
          app={app}
          onCopy={onCopy}
          onDelete={onDelete}
          primaryLabel="Configure"
          onPrimary={() => onOpenSettings?.(app)}
        />
      ))}
    </div>
  );
}
