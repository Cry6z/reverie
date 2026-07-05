import React from "react";
import { X, Lock, Key } from "lucide-react";

interface LoginScreenProps {
  passcode: string;
  setPasscode: (p: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  authError: boolean;
  onClose: () => void;
}

export default function LoginScreen({
  passcode,
  setPasscode,
  handleLogin,
  authError,
  onClose,
}: LoginScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0d0c0b]/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="max-w-md w-full border border-white/10 bg-[#151413]/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_25px_55px_rgba(0,0,0,0.7)] flex flex-col gap-6 relative transition-all duration-300 animate-scale-up-bounce">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-foreground/40 hover:text-foreground p-1.5 hover:bg-white/5 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center text-center gap-2">
          <div className="bg-[#fff4d6]/10 text-[#fff4d6] border border-[#fff4d6]/20 p-3.5 rounded-full mb-1.5">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-serif font-bold tracking-tight text-white">
            Akses Penulis Dongeng
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed max-w-xs">
            Kamar menulis ini terproteksi. Masukkan kata kunci rahasia untuk mengelola cerita dan lagu pengantar tidur.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="passcode" className="text-[9px] font-bold tracking-widest uppercase text-muted-custom">
              Kata Kunci Rahasia
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                id="passcode"
                placeholder="Ketik kata kunci di sini..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-yellow-500/60 focus:ring-4 focus:ring-yellow-500/10 px-4 py-3 pl-10 rounded-xl text-sm focus:outline-none text-foreground transition-all duration-300 placeholder:text-white/20"
                autoFocus
              />
              <Key className="w-4 h-4 text-white/30 absolute left-3.5" />
            </div>
            {authError && (
              <span className="text-[10px] text-red-400 font-medium animate-pulse mt-0.5">
                Sandi tidak cocok. Petunjuk: Panggilan manisnya (6 huruf).
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-[#0d0c0b] hover:bg-[#fff4d6] py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-[0.98] shadow-md shadow-white/5 cursor-pointer"
          >
            Masuk Kamar Menulis
          </button>
        </form>
      </div>
    </div>
  );
}
