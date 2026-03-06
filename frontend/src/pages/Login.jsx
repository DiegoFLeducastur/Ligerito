import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí es donde en el futuro llamaremos a Spring Boot
    // Por ahora, simulamos el acceso
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-800 p-3 rounded-2xl mb-4 text-white">
            <span className="material-symbols-outlined text-4xl">scale</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-800">
            Ligerito<span className="text-blue-500">.</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Control de peso para tus aventuras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">mail</span>
              <input 
                type="email" 
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-slate-700"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">lock</span>
              <input 
                type="password" 
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-slate-700"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Iniciar Sesión</span>
            <span className="material-symbols-outlined text-xl font-light">login</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            ¿No tienes cuenta? <span className="text-blue-500 font-bold cursor-pointer hover:underline">Regístrate gratis</span>
          </p>
        </div>
      </div>
    </div>
  );
}