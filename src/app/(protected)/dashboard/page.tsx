import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DropZone from "@/components/DropZone";
import ChatInterface from "@/components/ChatInterface";
import QuizGenerator from "@/components/QuizGenerator"; // Import the QuizGenerator component


export default async function Dashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="flex flex-col md:flex-row h-screen gap-4 p-4">
      <div className="w-full md:w-1/3">
        <DropZone userId={session.user!.id!} />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <ChatInterface userId={session.user!.id!} />
        <QuizGenerator />
      </div>
    </main>
  );
}