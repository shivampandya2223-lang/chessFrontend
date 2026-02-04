import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600">
      <div
        className="
          w-95
          rounded-2xl
          bg-white/20
          backdrop-blur-xl
          border border-white/30
          shadow-2xl
          p-8
        "
      >
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/home");
          }}
          className="flex flex-col gap-4"
        >
          {/* Username (Register only) */}
          {isRegister && (
            <input type="text" placeholder="Username" className="glass-input" />
          )}

          <input
            type="email"
            placeholder="Email address"
            className="glass-input"
          />

          <input
            type="password"
            placeholder="Password"
            className="glass-input"
          />

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="glass-input"
            />
          )}

          <button
            className="
              mt-2 py-3 rounded-lg
              bg-white text-purple-700
              font-semibold
              hover:bg-opacity-90
              transition
            "
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6 text-sm text-white/80">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="submit"
                onClick={() => setIsRegister(false)}
                className="font-semibold underline cursor-pointer hover:text-white hover:cursor-pointer"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="submit"
                onClick={() => setIsRegister(true)}
                className="font-semibold underline cursor-pointer hover:text-white"
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
          transition: border 0.2s ease;
        }

        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .glass-input:focus {
          border-color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
