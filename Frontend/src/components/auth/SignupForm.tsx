import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signup } from "@/api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup({ name, email, password });
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-16">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing up…" : "Sign up"}
      </Button>
      {error && <p className="text-red-600">{error}</p>}
      <div className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
