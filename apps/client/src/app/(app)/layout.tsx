'use client';

import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  Search, 
  Library, 
  PlusSquare, 
  Heart, 
  LogOut, 
  Settings, 
  UserCircle,
  Video
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#9E398D] border-t-transparent animate-spin" />
      </div>
    );
  }

  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group",
          isActive ? "bg-[#9E398D]/10 text-[#9E398D]" : "text-neutral-400 hover:text-white hover:bg-white/5"
        )}
      >
        <Icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive && "text-[#9E398D]")} />
        <span className="text-sm tracking-tight">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 bg-[#0a0a0a]">
        <Link href="/feed" className="px-4">
          <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#9E398D] to-[#521E49]">
            SKYLIVE
          </h1>
        </Link>
        
        <nav className="flex-1 space-y-2">
          <NavItem href="/feed" icon={Home} label="Feed" />
          <NavItem href="/search" icon={Search} label="Discover" />
          <NavItem href="/subscriptions" icon={Heart} label="Subscribed" />
          <NavItem href="/library" icon={Library} label="My Library" />
          
          <div className="pt-8 pb-4">
            <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Creator Studio</span>
          </div>
          
          <NavItem href="/creator/studio" icon={Video} label="Go Live" />
          <NavItem href="/creator/upload" icon={PlusSquare} label="New Post" />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
             <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white border border-white/10 ring-2 ring-transparent transition-all hover:ring-[#9E398D]/30 cursor-pointer">
               {user.displayName?.[0].toUpperCase() || 'U'}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-bold truncate">{user.displayName || 'User'}</p>
               <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
             </div>
          </div>
          <button 
             onClick={() => logout()}
             className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-neutral-500 hover:text-red-500 hover:bg-red-500/5 transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-black scrollbar-hide">
        {children}
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
