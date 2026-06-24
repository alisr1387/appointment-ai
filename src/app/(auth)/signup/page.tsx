import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-bold text-white">Create your account</h1>
      <p className="mb-6 text-sm text-slate-400">
        Start building your AI-powered conversion system in minutes.
      </p>
      <SignupForm />
    </>
  );
}
