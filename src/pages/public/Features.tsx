import { Brain, Camera, Upload, Zap, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: Brain,
    title: 'Advanced AI Detection',
    desc: 'Deep learning CNN model trained on an extensive dataset of fruit imagery for high-precision freshness classification.',
  },
  {
    icon: Camera,
    title: 'Real-time Camera Mode',
    desc: 'Instant visual analysis via webcam interface, providing real-time quality assessments.',
  },
  {
    icon: Upload,
    title: 'High-Resolution Upload Support',
    desc: 'Upload a single high-resolution image (JPEG, PNG, or WebP up to 10 MB) for fast freshness analysis.',
  },
  {
    icon: Zap,
    title: 'High-Performance Inference',
    desc: 'System architecture optimized for low-latency responses, delivering data-driven insights in sub-two-second intervals.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-Grade Security',
    desc: 'Robust Google OAuth integration and Row Level Security protocols for isolated and secure data management.',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics Engine',
    desc: 'Comprehensive scanning history visualization using interactive charts to identify quality trends over time.',
  },
];

export function Features() {
  const { signInWithGoogle, loading, user } = useAuth();

  return (
    <section className="relative min-h-[calc(100svh-8rem)] px-4 sm:px-6 py-8 md:py-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-44 -right-40 w-[520px] h-[520px] bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-primary/20">
            <span>Capability Stack</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-tight">
            One platform. Multiple intelligence layers.
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg md:text-xl">
            FructaVision combines inference speed, robust security, and actionable analytics in a single workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="relative bg-card border border-border/50 rounded-3xl p-5 md:p-6 hover:border-primary/40 hover:shadow-2xl transition-all group animate-in fade-in zoom-in-95 duration-500"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-base text-muted-foreground/90 leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          {!user && (
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="inline-flex items-center space-x-3 bg-foreground text-background px-6 py-3 rounded-2xl font-semibold hover:bg-foreground/90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60 text-base"
            >
              <span>Activate Platform Access</span>
            </button>
          )}

          <Link
            to="/team"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground border border-border/60 hover:border-border px-6 py-3 rounded-2xl font-semibold transition-all text-base"
          >
            Meet the Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
