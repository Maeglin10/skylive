import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black">
      <main className="max-w-2xl text-center space-y-8 animate-fade-in">
        <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#9E398D] to-[#521E49]">
          SKYLIVE
        </h1>
        <p className="text-xl text-neutral-400 font-medium">
          The future of decentralized streaming and content creation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/register" 
            className="px-8 py-3 rounded-full bg-[#9E398D] text-white font-bold hover:bg-[#b04aa0] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(158,57,141,0.3)]"
          >
            Join the Revolution
          </Link>
          <Link 
            href="/feed" 
            className="px-8 py-3 rounded-full border border-[#521E49] text-white font-bold hover:bg-white/5 transition-all"
          >
            Explore Feed
          </Link>
        </div>
      </main>
    </div>
  );
}
