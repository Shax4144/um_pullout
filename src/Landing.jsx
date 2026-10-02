import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credential, setCredential] = useState({
    username: "",
    password: ""
  });


  const handleChange = (field) => (e) => {
		setCredential((prev) => ({ ...prev, [field]: e.target.value }))
  }
  
  const handleSubmit = async () => {
    console.log("Login Submitted")
  }
  
  return (
    <div className="relative flex h-screen w-full">
      {/* ------ LEFT PANEL ------ */}
      <div
        className="hidden lg:flex w-1/2 bg-slate-950 flex-col items-center justify-center gap-8 px-16 relative overflow-hidden rounded-sm"
      >
        <div className="flex flex-col items-center">
          <div></div>
        </div>
      </div>

      {/* ------ RIGHT PANEL ------ */}
      <div className="flex flex-col w-full lg:w-1/2 px-8 bg-cyan-600 rounded-sm">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">

            {/* ------ HEADER ------ */}
            <div className="flex justify-center lg:mb-8">
							<h2 className="hidden lg:inline text-2xl font-semibold">LOGIN</h2>
						</div>
            
            {/* ------ FORM ------ */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="username" className="text-sm font-medium">
									Username
								</Label>
								<Input
									id="username"
									type="text"
									placeholder="Enter your username"
									value={credential.username}
									onChange={handleChange("username")}
									required
									className="h-10"
									disabled={isLoggingIn}
								/>
							</div>
      
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center justify-between">
									<Label
										htmlFor="password"
										className="text-sm font-medium text-slate-700"
									>
										Password
									</Label>
								</div>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={credential.password}
										onChange={handleChange("password")}
										required
										className="h-10 pr-10"
										disabled={isLoggingIn}
									/>
									<button
										type="button"
										onClick={() => setShowPassword((v) => !v)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
										tabIndex={-1}
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										disabled={isLoggingIn}
									>
										{showPassword ? "Hide" : "Show"}
									</button>
								</div>
							</div>
      
							<Button
								type="submit"
								disabled={isLoggingIn}
								className="h-10 font-medium transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
