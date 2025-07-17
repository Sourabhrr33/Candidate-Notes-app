import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Sign up</h1>
      <SignupForm />
    </div>
  );
}
