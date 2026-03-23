'use client';

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, VideoIcon, FileTextIcon, Lock, DollarSign, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export function ContentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [accessRule, setAccessRule] = useState<'FREE' | 'SUBSCRIPTION' | 'PPV'>('FREE');
  const [price, setPrice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
    }, 2000);
  };

  return (
    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl space-y-8 animate-fade-in group">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
          Share Content <Upload className="w-5 h-5 text-neutral-500 group-hover:-translate-y-1 transition-transform" />
        </h2>
      </div>

      <div className="space-y-6">
        {/* Upload Dropzone */}
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/5 rounded-2xl bg-white/2 hover:bg-white/5 hover:border-[#9E398D]/30 transition-all cursor-pointer p-12 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-900 mx-auto flex items-center justify-center border border-white/10 ring-4 ring-transparent group-hover:ring-[#9E398D]/10 transition-all">
              <Upload className="w-8 h-8 text-[#9E398D]" />
            </div>
            <div>
              <p className="font-bold text-sm">Drag & Drop or Click to Upload</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-black mt-1">Image, Video, or PDF</p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*,video/*,application/pdf"
            />
          </div>
        ) : (
          <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden group/preview border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="font-bold text-sm mb-1">{file.name}</p>
                <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-black">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/50 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Access Rules */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Access Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'FREE', icon: Sparkles, label: 'Free' },
              { id: 'SUBSCRIPTION', icon: Lock, label: 'Subs' },
              { id: 'PPV', icon: DollarSign, label: 'PPV' }
            ].map((rule) => {
              const ruleId = rule.id as 'FREE' | 'SUBSCRIPTION' | 'PPV';
              const active = accessRule === ruleId;
              const Icon = rule.icon;
              return (
                <button
                  key={rule.id}
                  onClick={() => setAccessRule(ruleId)}
                  className={clsx(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all text-[10px] font-black uppercase tracking-wider",
                    active 
                      ? "border-[#9E398D] bg-[#9E398D]/10 text-[#9E398D] shadow-[0_0_20px_rgba(158,57,141,0.2)]" 
                      : "border-white/5 bg-white/2 text-neutral-400 hover:border-white/10 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  {rule.label}
                </button>
              );
            })}
          </div>
        </div>

        {accessRule === 'PPV' && (
          <div className="animate-fade-in space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Price (USD)</label>
            <div className="relative">
               <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
               <input 
                 value={price}
                 onChange={(e) => setPrice(e.target.value)}
                 placeholder="0.00"
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#9E398D]/50 transition-all"
               />
            </div>
          </div>
        )}

        <button 
          disabled={!file || isUploading}
          onClick={handleUpload}
          className="w-full py-4 rounded-xl gradient-primary text-white font-black tracking-widest uppercase text-sm shadow-[0_10px_30px_-5px_rgba(158,57,141,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:bg-neutral-800 disabled:scale-100 flex items-center justify-center gap-3"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Content"
          )}
        </button>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  );
}
