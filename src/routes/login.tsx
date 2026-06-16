import { useState, FormEvent } from "react";
import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { getSession, loginWithCredentials } from "../utils/auth.server";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Login | Bimba Nepal" },
      { name: "description", content: "Access the administrator account area safely." },
    ],
  }),
  component: LoginPageComponent,
});

function LoginPageComponent() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoggingIn(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      await loginWithCredentials({ data: formData });
      toast.success("Successfully logged in.");

      navigate({ to: "/admin" });
    } catch (err) {
      console.log({ err });
      setError("Invalid username or password. Please try again.");
      toast.error("Authentication failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bimba Nepal
          </Link>
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">
            Log in to manage notices, reports, and newsletters
          </p>
        </div>

        <Card className="border-border bg-card/70 backdrop-blur-md shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoggingIn}
                  placeholder="Enter admin username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                  placeholder="Enter password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Login as Administrator
              </Button>
              <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed">
                Bimba Nepal Admin Portal • Secure Local Session
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
