import React, { useState } from "react";
import Footer from "../components/Footer";
import { login } from "../services/apiAuth";

export default function Login({ onLogin, onIrARegistro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      onLogin?.(data);
    } catch (err) {
      console.error(err);
      setError(err.message ?? "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
        {/* LOGO Y CABECERA */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-800 p-3 rounded-2xl mb-4 text-white shadow-lg">
            <span className="material-symbols-outlined text-4xl">scale</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-800">
            Ligerito<span className="text-blue-500">.</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Control de peso inteligente para tus viajes
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">
                mail
              </span>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">
                lock
              </span>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* BOTÓN DE ACCESO */}
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Iniciar Sesión</span>
            <span className="material-symbols-outlined text-xl font-light">
              login
            </span>
          </button>
        </form>

        {/* ENLACE A REGISTRO */}
        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <p className="text-xs text-slate-400">
            ¿No tienes cuenta aún?{" "}
            <span
              onClick={onIrARegistro}
              className="text-blue-500 font-bold cursor-pointer hover:underline"
            >
              Regístrate gratis
            </span>
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
