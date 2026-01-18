import AppCard from "../AppCard";

export default function AppsGrid({ apps, onCopy, onDelete, onOpenApp }) {
  return (
    <div className="mt-10 max-w-7xl mx-auto w-full">
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
        {apps.map((app) => (
          <AppCard
            key={app.apiKey}
            app={app}
            onCopy={onCopy}
            onDelete={onDelete}
            onViewChats={() => onOpenApp(app)}
          />
        ))}
      </div>
    </div>
  );
}
