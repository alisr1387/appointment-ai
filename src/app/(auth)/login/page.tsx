import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-400">
        Sign in to manage your AI conversion system.
      </p>
      <LoginForm />
    </>
  );
}
