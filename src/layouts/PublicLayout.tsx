import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/use-theme';
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';

export function PublicLayout() {
  const { signInWithGoogle, loading, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Team', path: '/team' },
  ];

  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen overflow-x-hidden">
      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm' : 'bg-transparent'}`}>
        <div className="w-full px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group">
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">FructaVision<span className="text-primary">.</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-foreground ${location.pathname === link.path ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* CTA */}
            {user ? (
              <Link
                to="/dashboard"
                className="hidden md:flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-base font-semibold hover:bg-primary/90 active:scale-95 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="hidden md:flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-base font-semibold hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border px-6 py-4 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left text-sm font-medium py-2 transition-colors ${location.pathname === link.path ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
               <Link to="/dashboard" className="block w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold text-center mt-4">
                 Go to Dashboard
               </Link>
            ) : (
              <button
                onClick={() => { signInWithGoogle(); setMobileMenuOpen(false); }}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                Sign in with Google
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 flex-1">
        <Outlet />
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 px-4 sm:px-6 py-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">FructaVision</span>
            <span>· Intelligent Freshness Analysis</span>
          </div>
          <span>© {new Date().getFullYear()} FructaVision. Technology for sustainable consumption.</span>
        </div>
      </footer>
    </div>
  );
}
