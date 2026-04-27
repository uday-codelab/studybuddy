import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
import DropZone from "@/components/DropZone";
import ChatInterface from "@/components/ChatInterface";
import QuizGenerator from "@/components/QuizGenerator";

export default async function Dashboard() {
  const session = await auth();
  const isGuest = !session?.user;
  const userId = session?.user?.id ?? "guest";

  // Remove the redirect — allow guests through
  // Only redirect if someone is clearly not supposed to be here
  // (NextAuth will handle this via proxy.ts)

  return (
  <main className="flex flex-col gap-4 p-4">
    <div className="w-full space-y-3">
      {isGuest && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800 flex items-center justify-between">
          <span>Guest mode — data cleared after 24h</span>
          <a href="/login" className="underline font-medium">Sign in</a>
        </div>
      )}
      <DropZone userId={userId} />
    </div>
    <div className="flex flex-col gap-4">
      <ChatInterface userId={userId} />
      <QuizGenerator />
    </div>
  </main>
);
}