import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin05";

interface LoginPageProps {
  onLoginSuccess: (role: string, username: string, fullName: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [roleTab, setRoleTab] = useState<"employee" | "admin">("employee");
  const [modeTab, setModeTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Pending employee action: set when user clicks submit, resolved after II login
  const pendingAction = useRef<{
    mode: "login" | "register";
    username: string;
    fullName: string;
  } | null>(null);

  const { login, loginStatus } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const isLoggingIn = loginStatus === "logging-in" || loading || isFetching;

  const handleRoleChange = (v: string) => {
    setRoleTab(v as "employee" | "admin");
    if (v === "admin") setModeTab("login");
  };

  // React to II login success + actor ready
  useEffect(() => {
    if (!pendingAction.current) return;
    if (loginStatus === "loginError") {
      toast.error("Authentication failed. Please try again.");
      setLoading(false);
      pendingAction.current = null;
      return;
    }
    if (
      (loginStatus === "success" || loginStatus === "idle") &&
      actor &&
      !isFetching
    ) {
      const action = pendingAction.current;
      pendingAction.current = null;
      void (async () => {
        try {
          if (action.mode === "register") {
            await actor.saveCallerUserProfile({
              username: action.username,
              role: "employee",
              fullName: action.fullName || action.username,
            });
            toast.success("Registration successful!");
            onLoginSuccess(
              "employee",
              action.username,
              action.fullName || action.username,
            );
          } else {
            const profileResult = await actor.getCallerUserProfile();
            const profile = Array.isArray(profileResult)
              ? profileResult[0]
              : profileResult;
            if (!profile) {
              toast.error("No account found. Please register first.");
              setLoading(false);
              return;
            }
            if (profile.username !== action.username) {
              toast.error("Username does not match your registered account.");
              setLoading(false);
              return;
            }
            toast.success(`Welcome back, ${profile.fullName}!`);
            onLoginSuccess(profile.role, profile.username, profile.fullName);
          }
        } catch (err) {
          console.error(err);
          toast.error("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [loginStatus, actor, isFetching, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (roleTab === "admin") {
      if (!username.trim() || !password) {
        toast.error("Please enter username and password");
        return;
      }
      if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        toast.error("Invalid admin credentials");
        return;
      }
      toast.success("Welcome back, Admin!");
      onLoginSuccess("admin", ADMIN_USERNAME, "Administrator");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);

    // Store pending action and trigger II login popup
    pendingAction.current = {
      mode: modeTab,
      username: username.trim(),
      fullName: fullName.trim(),
    };
    login();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.94 0.01 200)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-black text-xl text-white"
                style={{ background: "oklch(0.60 0.18 165)" }}
              >
                IF
              </div>
            </div>
            <h1 className="font-display font-black text-2xl text-foreground tracking-tight">
              Infinexy Finance
            </h1>
            <p
              className="text-sm font-medium mt-1"
              style={{ color: "oklch(0.45 0.18 165)" }}
            >
              Payroll Management System
            </p>
          </div>

          <div className="px-8 pb-8">
            <Tabs
              value={roleTab}
              onValueChange={handleRoleChange}
              className="mb-5"
            >
              <TabsList className="w-full grid grid-cols-2 h-10 bg-muted">
                <TabsTrigger
                  value="employee"
                  data-ocid="login.employee.tab"
                  className="data-[state=active]:bg-white data-[state=active]:text-foreground text-sm font-semibold"
                >
                  Employee
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  data-ocid="login.admin.tab"
                  className="data-[state=active]:bg-white data-[state=active]:text-foreground text-sm font-semibold"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {roleTab === "employee" && (
              <Tabs
                value={modeTab}
                onValueChange={(v) => setModeTab(v as "login" | "register")}
                className="mb-6"
              >
                <TabsList className="w-full grid grid-cols-2 h-10 bg-muted">
                  <TabsTrigger
                    value="login"
                    data-ocid="login.login.tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-foreground text-sm font-semibold"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    data-ocid="login.register.tab"
                    className="data-[state=active]:bg-white data-[state=active]:text-foreground text-sm font-semibold"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {roleTab === "employee" && modeTab === "register" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-input border-border h-11"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Username
                </Label>
                <Input
                  data-ocid="login.username.input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-input border-border h-11"
                  autoComplete="username"
                />
              </div>
              {roleTab === "admin" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    data-ocid="login.password.input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-input border-border h-11"
                    autoComplete="current-password"
                  />
                </div>
              )}
              {roleTab === "employee" && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2">
                  {modeTab === "register"
                    ? "A popup will open to verify your identity via Internet Identity."
                    : "Enter your username and authenticate via the Internet Identity popup."}
                </p>
              )}
              <Button
                type="submit"
                data-ocid="login.submit_button"
                disabled={isLoggingIn}
                className="w-full h-11 font-bold text-sm mt-2 text-white"
                style={{ background: "oklch(0.60 0.18 165)" }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : modeTab === "login" || roleTab === "admin" ? (
                  "Sign In"
                ) : (
                  "Register"
                )}
              </Button>
            </form>

            {roleTab === "employee" && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                {modeTab === "login" ? (
                  <span>
                    No account?{" "}
                    <button
                      type="button"
                      className="underline font-semibold"
                      style={{ color: "oklch(0.45 0.18 165)" }}
                      onClick={() => setModeTab("register")}
                    >
                      Register here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="underline font-semibold"
                      style={{ color: "oklch(0.45 0.18 165)" }}
                      onClick={() => setModeTab("login")}
                    >
                      Login here
                    </button>
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
