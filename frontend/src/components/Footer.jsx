import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 w-full py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold text-blue-900">Ligerito</span>
          <p className="font-['Plus_Jakarta_Sans'] text-xs uppercase tracking-widest text-slate-400">
            © 2026 Ligerito. Creado para los ultraligeros o los apasionados de la organización.
          </p>
        </div>
      </div>
    </footer>
  );
}
