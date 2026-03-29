import { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, UserCircle2, LogOut, Settings } from "lucide-react";
import { useTheme } from "../hooks/use-theme";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name ?? user?.email ?? "User") as string;
  const email = user?.email ?? "";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-20 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 z-10 transition-colors">

      {/* Mobile Title & Menu */}
      <div className="flex items-center space-x-3 md:hidden">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">FructaVision</h1>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center rounded-full ring-2 ring-border hover:ring-primary/50 transition-all focus:outline-none active:scale-95"
            aria-label="User menu"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserCircle2 className="w-6 h-6" />
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-60 bg-card border border-border/60 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-border/50 flex items-center space-x-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-1.5">
                <button
                  onClick={() => { setDropdownOpen(false); navigate("/settings"); }}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
