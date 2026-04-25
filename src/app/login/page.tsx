import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}