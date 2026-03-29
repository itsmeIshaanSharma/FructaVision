import { Mail, Link, ExternalLink } from 'lucide-react';

const TEAM = [
  {
    name: 'Ishaan Sharma',
    role: 'Frontend & Backend Lead',
    bio: '2328027',
    img: '/team-1.png',
  },
  {
    name: 'Ayush Saini',
    role: 'ML Model Training and Integration Lead',
    bio: '23280',
    img: '/team-2.png',
  },
];

export function Team() {

  return (
    <section className="relative min-h-[calc(100svh-8rem)] px-4 sm:px-6 py-8 md:py-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-44 -right-40 w-[520px] h-[520px] bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-primary/20">
            <span>The Development Team</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-tight">
            Precision engineering for global food transparency.
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg md:text-xl">
            The FructaVision project is driven by a commitment to bridging computer vision and sustainable consumer habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto w-full">
        {TEAM.map((member, i) => (
          <div 
            key={i} 
            className="group bg-card border border-border/40 rounded-[2.5rem] p-7 md:p-8 text-center hover:shadow-2xl transition-all hover:border-primary/20 animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden mx-auto mb-6 ring-4 ring-border/50 group-hover:ring-primary/40 transition-all transform group-hover:scale-105">
              <img src={member.img} alt={member.name} className="w-full h-full object-cover object-top" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-1">{member.name}</h3>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-5">{member.role}</p>
            <p className="text-muted-foreground leading-relaxed font-medium mb-6 text-base">{member.bio}</p>
            
            <div className="flex items-center justify-center space-x-4 opacity-50 group-hover:opacity-100 transition-opacity">
               <button className="p-2 hover:text-primary transition-colors"><ExternalLink className="w-5 h-5" /></button>
               <button className="p-2 hover:text-primary transition-colors"><Mail className="w-5 h-5" /></button>
               <button className="p-2 hover:text-primary transition-colors"><Link className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
        </div>

        <div className="mt-5 px-5 py-3 bg-primary/5 rounded-2xl text-center border border-primary/10 max-w-3xl mx-auto w-full">
           <p className="text-sm md:text-base font-semibold italic leading-relaxed text-foreground/80">
             "Empowering smarter food decisions through real-time freshness intelligence."
           </p>
        </div>
      </div>
    </section>
  );
}
