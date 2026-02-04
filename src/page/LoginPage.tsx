import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../queries/auth.queries";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { mutate: login, isPending: loginLoading } = useLoginMutation();
  const { mutate: register, isPending: registerLoading } =
    useRegisterMutation();

  const isLoading = loginLoading || registerLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      register(
        { username, email, password },
        {
          onSuccess: () => {
            navigate("/home");
          },
        },
      );
    } else {
      login(
        { email, password },
        {
          onSuccess: () => {
            navigate("/home");
          },
        },
      );
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600">
      <div className="w-95 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {isRegister ? "Register to get started" : "Login to your account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />

          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="glass-input"
            />
          )}

          <button
            disabled={isLoading}
            className="mt-2 py-3 rounded-lg bg-white text-purple-700 font-semibold hover:bg-opacity-90 transition disabled:opacity-60"
          >
            {isLoading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 text-sm text-white/80">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-semibold underline hover:text-white"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-semibold underline hover:text-white"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .glass-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.3);
          color: white;
          outline: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
