import { useState, type ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col pt-20 min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5 md:p-7 lg:p-8 overflow-x-hidden transition-all">
          {children}
        </main>

        <footer className="border-t border-border/50 px-6 md:px-8 py-4">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">FructaVision</span>
              <span>· Intelligent Freshness Analysis</span>
            </div>
            <span>© {new Date().getFullYear()} FructaVision. Technology for sustainable consumption.</span>
          </div>
        </footer>
      </div>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
