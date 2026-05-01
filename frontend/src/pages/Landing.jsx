import React from "react";

export default function Landing({ onIrLogin, onIrRegistro }) {
  return (
    <div className="bg-slate-50 text-slate-900 overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-extrabold tracking-tighter text-blue-900">
            Ligerito
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-blue-900 font-bold border-b-2 border-blue-900 pb-1 text-sm"
              href="#features"
            >
              Funciones
            </a>
            <a
              className="text-slate-500 hover:text-blue-900 text-sm font-medium"
              href="#mochilas"
            >
              Mochilas
            </a>
            <a
              className="text-slate-500 hover:text-blue-900 text-sm font-medium"
              href="#comunidad"
            >
              Comunidad
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onIrLogin}
              className="px-5 py-2 text-blue-900 text-sm font-medium hover:opacity-80"
            >
              Iniciar sesión
            </button>
            <button
              onClick={onIrRegistro}
              className="px-5 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:opacity-90 shadow-sm"
            >
              Registrarse
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-[14px]">
                  speed
                </span>
                Control ultraligero
              </div>

              <h1 className="text-5xl font-bold tracking-tight leading-tight text-slate-900">
                Viaja ligero, <br />
                <span className="text-blue-900">llega más lejos</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Organiza tu equipo, crea mochilas por ruta y controla el peso
                total y por categorías con precisión.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onIrRegistro}
                  className="px-8 py-4 bg-blue-900 text-white rounded-lg font-semibold hover:opacity-90"
                >
                  Empezar ahora
                </button>
                <button
                  onClick={onIrLogin}
                  className="px-8 py-4 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-100 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  Ya tengo cuenta
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-900/5 rounded-[2rem] -rotate-3 scale-105" />

              <div className="bg-slate-100 rounded-xl p-3 shadow-xl relative overflow-hidden aspect-[4/3] border border-slate-200">
                <img
                  src="/equipoPortada.jpg"
                  alt="Vista previa de Ligerito"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1500px] mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-semibold">
                Qué puedes hacer con Ligerito
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Una herramienta sencilla para organizar tu equipo y controlar
                cada gramo de tu mochila.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="inventory_2"
                title="Armario reutilizable"
                text="Crea objetos una vez y reutilízalos en varias mochilas sin duplicar información."
                image="/Armario.PNG"
              />
              <FeatureCard
                icon="scale"
                title="Peso por categorías"
                text="Visualiza el peso total y el reparto entre ropa, cocina, descanso, electrónica y más."
                image="/Peso.PNG"
                imageClassName="max-w-full max-h-full object-contain scale-170 translate-x-26"
              />
              <FeatureCard
                icon="public"
                title="Mochilas públicas"
                text="Marca listas como públicas para compartirlas e inspirarte con otras preparaciones."
                image="/comunidad.PNG"
              />
            </div>
          </div>
        </section>

        <section id="mochilas" className="py-24 px-6">
          <div className="max-w-[1280px] mx-auto bg-slate-100 rounded-[2rem] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center border border-slate-200">
            <div className="space-y-6">
              <h2 className="text-4xl font-semibold">
                Diseñado para tus listas de viaje
              </h2>
              <p className="text-lg text-slate-600">
                Crea una mochila para cada ruta, añade categorías y reutiliza el
                equipo de tu armario general.
              </p>

              <ul className="space-y-4">
                <LandingCheck text="Cálculo automático del peso total." />
                <LandingCheck text="Edición de peso, descripción y enlaces de producto." />
                <LandingCheck text="Organización por categorías dentro de cada mochila." />
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-3 border border-slate-200 aspect-[4/3] overflow-hidden">
              <img
                src="/mochilaCompleta.PNG"
                alt="Vista real de la aplicación Ligerito"
                className="w-full h-full object-cover object-top rounded-lg"
              />
            </div>
          </div>
        </section>

        <section id="comunidad" className="py-24 px-6 bg-blue-900 text-white">
          <div className="max-w-[1280px] mx-auto text-center space-y-10">
            <h2 className="text-4xl font-semibold">
              Prepara tu próxima ruta con menos peso
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Empieza creando tu cuenta y organiza tu equipo de forma clara,
              visual y ligera.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={onIrRegistro}
                className="w-full sm:w-auto px-10 py-5 bg-white text-blue-900 rounded-lg font-semibold hover:bg-slate-100 shadow-xl"
              >
                Crear cuenta gratis
              </button>
              <button
                onClick={onIrLogin}
                className="w-full sm:w-auto px-10 py-5 border border-blue-200 text-white rounded-lg font-semibold hover:bg-white/10"
              >
                Iniciar sesión
              </button>
            </div>

            <p className="text-blue-100 text-xs uppercase tracking-widest">
              Armario reutilizable • Mochilas públicas • Control de peso
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-xl font-bold text-blue-900">Ligerito</div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-2">
              Proyecto de organización de mochilas y control de peso.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-slate-500">
            <a href="#features" className="hover:text-blue-900">
              Funciones
            </a>
            <a href="#mochilas" className="hover:text-blue-900">
              Mochilas
            </a>
            <a href="#comunidad" className="hover:text-blue-900">
              Comunidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, text, image, imageClassName }) {
  return (
    <div className="p-10 rounded-xl border border-slate-200 bg-white hover:border-blue-900/50 transition-colors group min-h-[520px]">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
        <span className="material-symbols-outlined text-blue-900 text-[28px]">
          {icon}
        </span>
      </div>

      <h3 className="text-2xl font-semibold mb-3">{title}</h3>

      <p className="text-slate-600 leading-relaxed">{text}</p>

      {image && (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 h-64 flex items-center justify-center p-4">
          <img
            src={image}
            alt={title}
            className={
              imageClassName ??
              "max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            }
          />
        </div>
      )}
    </div>
  );
}

function LandingCheck({ text }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-6 h-6 rounded-full bg-blue-900/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-blue-900 text-[14px]">
          check
        </span>
      </span>
      <span className="text-slate-700">{text}</span>
    </li>
  );
}

function MockItem({ name, weight }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
      <span className="font-medium text-slate-700">{name}</span>
      <span className="text-sm font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded-md">
        {weight}
      </span>
    </div>
  );
}
