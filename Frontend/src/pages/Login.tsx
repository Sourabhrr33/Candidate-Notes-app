import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Log in</h1>
      <LoginForm />
    </div>
  );
}
