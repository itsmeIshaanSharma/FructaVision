import { MainLayout } from "../layouts/MainLayout";
import { useTheme } from "../hooks/use-theme";
import { useAuth } from "../contexts/AuthContext";
import { Moon, Sun, Trash2, UserCircle2, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name ?? user?.email ?? "User") as string;

  const handleClearHistory = async () => {
    if (!user) return;
    const confirmed = window.confirm("Are you sure? This will permanently delete all your scan history.");
    if (!confirmed) return;
    await supabase.from("scans").delete().eq("user_id", user.id);
    alert("Scan history cleared.");
  };

  return (
    <MainLayout>
      <div className="flex flex-col max-w-2xl mx-auto w-full space-y-5 md:space-y-6">

        {/* Header Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-2 text-foreground flex items-baseline">
            Settings<span className="text-primary text-5xl">.</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>

        {/* Account */}
        <section className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4 border-b border-border/50 pb-3 text-foreground">Account</h3>
          <div className="flex items-center space-x-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-14 h-14 rounded-full ring-2 ring-border object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle2 className="w-8 h-8 text-primary" />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground text-base">{displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4 border-b border-border/50 pb-3 text-foreground">Appearance</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-xl transition-colors font-medium text-sm border border-border/50"
            >
              {theme === "dark" ? <><Sun className="w-4 h-4" /><span>Light Mode</span></> : <><Moon className="w-4 h-4" /><span>Dark Mode</span></>}
            </button>
          </div>
        </section>

        {/* Data */}
        <section className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4 border-b border-border/50 pb-3 text-foreground">Data</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Clear Scan History</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all your past scans.</p>
            </div>
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 rounded-xl transition-colors font-medium text-sm border border-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </section>

        {/* Sign Out */}
        <section className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4 border-b border-border/50 pb-3 text-foreground">Session</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-sm">Sign Out</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sign out of your FructaVision account.</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-xl transition-colors font-medium text-sm border border-border/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
