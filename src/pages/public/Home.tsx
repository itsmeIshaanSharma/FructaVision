import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Brain, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { signInWithGoogle, loading, user } = useAuth();

  return (
    <section className="relative min-h-[calc(100svh-8rem)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 md:py-10 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-5 md:mb-7 border border-primary/20">
          <span>✨</span>
          <span>AI-Powered Fruit Freshness Analysis</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4 md:mb-6 leading-none">
          FructaVision<span className="text-primary">.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-7 md:mb-9 max-w-2xl mx-auto">
          Eliminate uncertainty in fruit quality assessment. The integrated CNN model analyzes fruit images in seconds, 
          providing objective freshness data, confidence metrics, and estimated shelf-life.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 bg-foreground text-background px-8 py-4 rounded-2xl font-semibold hover:bg-foreground/90 active:scale-[0.98] transition-all shadow-lg text-base"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="flex items-center space-x-3 bg-foreground text-background px-7 py-4 rounded-2xl font-semibold hover:bg-foreground/90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60 text-base"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Get Started with Google</span>
            </button>
          )}

          <Link
            to="/features"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground border border-border/60 hover:border-border px-7 py-4 rounded-2xl font-semibold transition-all text-base"
          >
            <span>Platform Features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Status bar */}
        <div className="mt-8 md:mt-12 hidden sm:flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground uppercase tracking-widest font-bold">
          <span className="flex items-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" /><span>Secure OAuth</span></span>
          <span className="flex items-center space-x-1.5"><Zap className="w-3.5 h-3.5 text-primary" /><span>Real-time Analysis</span></span>
          <span className="flex items-center space-x-1.5"><Brain className="w-3.5 h-3.5 text-primary" /><span>CNN Integration</span></span>
          <span className="flex items-center space-x-1.5"><BarChart3 className="w-3.5 h-3.5 text-primary" /><span>Analytics Engine</span></span>
        </div>
      </div>
    </section>
  );
}
