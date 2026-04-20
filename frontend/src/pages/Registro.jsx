import React, { useState } from 'react';

export default function Registro({ onRegistro, onIrALogin }) {
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nick && email && password) {
      // Simulación temporal de registro
      onRegistro?.();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-800 p-3 rounded-2xl mb-4 text-white">
            <span className="material-symbols-outlined text-4xl">person_add</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Únete a Ligerito</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Empieza a organizar tus aventuras sin peso extra
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Nick
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all"
              placeholder="Diego G."
              value={nick}
              onChange={(e) => setNick(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
          >
            Crear Cuenta
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={onIrALogin}
              className="text-blue-500 font-bold cursor-pointer hover:underline"
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}