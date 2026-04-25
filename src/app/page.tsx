import { signIn } from "@/lib/auth";

export default function LoginPage() {
  async function handleSignIn() {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center space-y-6">
        <div className="space-y-2">
          <span className="text-5xl">📚</span>
          <h1 className="text-2xl font-bold text-gray-900">StudyBuddy</h1>
          <p className="text-gray-500 text-sm">
            Upload PDFs. Ask questions. Quiz yourself.<br />
            Every document cryptographically verified on-chain.
          </p>
        </div>

        <form action={handleSignIn}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.2z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.9 14.8 48 24 48z"/>
              <path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.7C1 17.4 0 20.6 0 24s1 6.6 2.7 9.9l8.1-5.1z"/>
              <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.4 0 24 0 14.8 0 6.7 5.1 2.7 12.6l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-xs text-gray-400">
          Your documents are private and encrypted.<br/>
          Powered by Neon · Grok · Sepolia
        </p>
      </div>
    </div>
  );
}