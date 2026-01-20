import ChatCard from "./ChatCard";

export default function ChatsGrid({ apps = [], onOpen }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app) => (
        <ChatCard key={app.apiKey} app={app} onOpen={onOpen} />
      ))}
    </div>
  );
}
