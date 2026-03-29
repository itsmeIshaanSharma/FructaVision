import { LayoutDashboard, LineChart, Settings as SettingsIcon, Plus, X, Info, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen w-64 bg-background border-r flex flex-col justify-between z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 shadow-2xl md:shadow-none`}
    >
      {/* Top Section */}
      <div className="p-6">
        <div className="mb-10 flex items-start justify-between text-left">
          <NavLink to="/" className="block">
            <h1 className="text-xl font-bold tracking-tight text-foreground">FructaVision</h1>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Autonomous Quality Analysis</p>
          </NavLink>
          <button 
            onClick={onClose}
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 font-semibold">
          <div className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Platform</div>
          
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all group ${
              isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-sm">Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all group ${
              isActive ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <LineChart className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-sm">Analytics Engine</span>
          </NavLink>

          <div className="px-4 py-2 mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Information</div>

          <NavLink 
            to="/features" 
            className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all group ${
              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-sm">Capabilities</span>
          </NavLink>

          <NavLink 
            to="/team" 
            className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all group ${
              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm">Engineering Team</span>
          </NavLink>

          <div className="px-4 py-2 mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Account</div>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => `flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all group ${
              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-sm">System Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-border/50">
        <button 
          onClick={() => {
            navigate('/dashboard');
            onClose();
          }}
          className="flex items-center justify-center space-x-2 w-full bg-foreground text-background py-3.5 px-4 rounded-2xl font-bold shadow-md transition-all active:scale-[0.98] hover:bg-foreground/90"
        >
          <Plus className="w-5 h-5" />
          <span>New Analysis</span>
        </button>
      </div>
    </aside>
  );
}
