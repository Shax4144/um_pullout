import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  ShieldAlert,
  FileQuestion,
  ArrowLeft,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getReturnPath,
  hasRouteAccess,
} from "../utils/route-access";

const exceptionConfig = {
  401: {
    title: "AUTHENTICATION REQUIRED",
    heading: "SESSION EXPIRED",
    description:
      "Your session is missing or has expired. Please sign in to continue.",
    icon: LockKeyhole,
    color: "text-[#00d3f2]",
    iconBackground: "bg-[#007595]/20",
    badge: "401 UNAUTHORIZED",
    status: "NOT AUTHENTICATED",
    statusColor: "text-amber-400",
    buttonText: "Go to Login",
  },
  403: {
    title: "ACCESS CONTROL RESPONSE",
    heading: "ACCESS DENIED",
    description:
      "You are authenticated, but your account does not have permission to access this resource.",
    icon: ShieldAlert,
    color: "text-[#ce514d]",
    iconBackground: "bg-[#ce514d]/15",
    badge: "403 FORBIDDEN",
    status: "AUTHENTICATED",
    statusColor: "text-emerald-400",
    buttonText: "Return to Accessible Page",
  },
  404: {
    title: "RESOURCE RESPONSE",
    heading: "PAGE NOT FOUND",
    description:
      "The requested page could not be found. It may have been moved, removed, or entered incorrectly.",
    icon: FileQuestion,
    color: "text-[#29aeb2]",
    iconBackground: "bg-[#29aeb2]/15",
    badge: "404 NOT FOUND",
    status: "RESOURCE UNAVAILABLE",
    statusColor: "text-amber-400",
    buttonText: "Back to Workspace",
  },
};

const ExceptionPage = ({ code }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userPermissions = user?.permissions ?? [];

  const config = exceptionConfig[code];
  const Icon = config.icon;

  const handleNavigation = () => {
    if (code === 401) {
      navigate("/", { replace: true });
      return;
    }

    const destination = getReturnPath({
      code,
      userPermissions,
    });

    navigate(destination, { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-sidebar px-5 py-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-[#29aeb2]" />

              <span className="text-sm font-semibold tracking-wide text-sidebar-foreground">
                SYSTEM RESPONSE
              </span>
            </div>

            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-sidebar-foreground">
              {config.badge}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6 sm:p-9">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
              <div
                className={`mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl sm:mb-0 ${config.iconBackground}`}
              >
                <Icon className={`h-8 w-8 ${config.color}`} />
              </div>

              <div className="space-y-2">
                <p className="font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                  {config.title}
                </p>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {config.heading}
                </h1>

                <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                  {config.description}
                </p>
              </div>
            </div>

            {/* Diagnostic panel */}
            <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
              <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                <span className="h-2 w-2 rounded-full bg-[#29aeb2]" />
                <span className="font-semibold tracking-wider text-muted-foreground">
                  RESPONSE DETAILS
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">STATUS CODE</span>
                  <span className="font-semibold">{code}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">RESPONSE</span>
                  <span className={config.color}>{config.badge}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">AUTHENTICATION</span>
                  <span className={config.statusColor}>{config.status}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-center sm:justify-start">
              <Button
                onClick={handleNavigation}
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                {code !== 401 && <ArrowLeft className="h-4 w-4" />}
                {config.buttonText}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-6 py-3">
            <p className="text-center font-mono text-[10px] tracking-wider text-muted-foreground sm:text-left">
              SYSTEM ACCESS CONTROL · PLEASE CONTACT YOUR ADMINISTRATOR IF
              THIS ISSUE PERSISTS
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExceptionPage;