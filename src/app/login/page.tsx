import { signIn } from "@/lib/auth";

export default function LoginPage() {
  console.log("Rendering Login Page");
  
  async function handleLogin() {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="mb-6 text-2xl font-bold">Study Buddy Login</h1>
        <form action={handleLogin}>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}