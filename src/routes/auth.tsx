import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner Login — Sachin Unisex Salon" },
      { name: "description", content: "Secure login for the salon owner to manage products, orders and the website." },
      { property: "og:title", content: "Owner Login — Sachin Unisex Salon" },
      { property: "og:description", content: "Salon owner access to the store dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. Check your email to confirm, then sign in.");
      setMode("signin");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const field = "mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 px-5 py-16">
      <div className="w-full max-w-md border border-border bg-card p-10">
        <Link to="/" className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
          ← Back to site
        </Link>
        <h1 className="mt-6 font-display text-4xl">{mode === "signin" ? "Owner login" : "Create owner account"}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage products, orders and the look of the site."
            : "The first account created becomes the salon owner."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Email</span>
            <input type="email" required className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Password</span>
            <input
              type="password"
              required
              minLength={6}
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-xs tracking-[0.18em] text-muted-foreground uppercase"
        >
          {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
