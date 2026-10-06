import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mis_logo from "@/assets/MIS_logo.png";
import { toast } from "@/components/ui/toast";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);

  //temporary dummy credential
  const TEMP_USERNAME = "cjdaroy";
  const TEMP_PASSWORD = "1";

  const [credential, setCredential] = useState({
    username: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setCredential((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError("");
    setIsLoggingIn(true);

    // try {
    //   console.log("Login Submitted", credential);

    //   // Add your login logic here
    //   //
    //   // Example:
    //   // const response = await dispatch(login(credential)).unwrap();
    //   // navigate("/dashboard");
    // } catch (error) {
    //   console.error("Login failed:", error);
    // } finally {
    //   setIsLoggingIn(false);
    // }
    try {
      // Temporary login validation
      const isValid =
        credential.username === TEMP_USERNAME &&
        credential.password === TEMP_PASSWORD;

      if (!isValid) {
        setLoginError("Invalid username or password.");

        toast.add({
          type: "error",
          title: "Login failed",
          description: loginError,
        });

        return;
      }
      console.log("Temporary login successful:", credential.username);
      toast.add({
        type: "success",
        title: "Login successful!",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Something went wrong while signing in.");
      toast.add({
        type: "error",
        title: "Login failed",
        description: error?.message || "There was an error logging in.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-900 px-4 py-8">
      {/* =========================================================
          BACKGROUND GLOWS
      ========================================================= */}

      {/* Blue glow - top left */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-125
          w-125
          rounded-full
          bg-blue-600/25
          blur-[120px]
        "
      />

      {/* Teal glow - bottom right */}
      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-125
          w-125
          rounded-full
          bg-teal-500/25
          blur-[120px]
        "
      />

      {/* Subtle cyan glow - center */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-87.5
          w-87.5
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/5
          blur-[100px]
        "
      />

      {/* Optional subtle ambient gradient */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)]
        "
      />

      {/* =========================================================
          LOGIN CONTAINER
      ========================================================= */}
      <div className="relative flex flex-col z-10 w-full max-w-md justify-between">
        {/* Glass Card */}
        <div
          className="
            rounded-2xl
            border
            border-white/15
            bg-white/10
            p-8
            shadow-2xl
            backdrop-blur-2xl
            sm:p-10
          "
        >
          {/* =====================================================
              HEADER
          ===================================================== */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              LOGIN
            </h1>

            <p className="mt-2 text-sm text-white/60">
              Sign in to continue to your account
            </p>
          </div>

          {/* =====================================================
              FORM
          ===================================================== */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* ===================================================
                USERNAME
            =================================================== */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-white/90"
              >
                Username
              </Label>

              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={credential.username}
                onChange={handleChange("username")}
                required
                disabled={isLoggingIn}
                autoComplete="username"
                className="
                  h-11
                  rounded-lg
                  border-white/15
                  bg-white/5
                  text-white
                  shadow-none
                  placeholder:text-white/40
                  transition-all
                  focus-visible:border-teal-400/50
                  focus-visible:ring-2
                  focus-visible:ring-teal-400/30
                "
              />
            </div>

            {/* ===================================================
                PASSWORD
            =================================================== */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-white/90"
              >
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credential.password}
                  onChange={handleChange("password")}
                  required
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                  className="
                    h-11
                    rounded-lg
                    border-white/15
                    bg-white/5
                    pr-11
                    text-white
                    shadow-none
                    placeholder:text-white/40
                    transition-all
                    focus-visible:border-teal-400/50
                    focus-visible:ring-2
                    focus-visible:ring-teal-400/30
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoggingIn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-white/40
                    transition-colors
                    hover:text-white/80
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ===================================================
                LOGIN BUTTON
            =================================================== */}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="
                mt-2
                h-11
                w-full
                rounded-lg
                bg-primary
                font-medium
                text-primary-foreground
                shadow-lg
                transition-all
                hover:bg-primary/90
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <div className="flex flex-col mt-8 items-center">
            <img src={mis_logo} alt="MIS Logo" className="h-12 w-12" />
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Powered by
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Management Information System
            </p>
          </div>
        </div>
        {/* =====================================================
            VERSION
        ===================================================== */}
      </div>
      <div className="absolute bottom-0 right-2 z-10">
        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.0 · Patched on: October 05, 2026
        </p>
      </div>
    </div>
  );
};

export default Landing;
