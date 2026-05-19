const BASE = "/auth";

export const register = async (nick, email, password) => {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick, email, password }),
  });

  if (!res.ok) {
    if (res.status === 409) throw new Error("El email o nick ya están en uso.");
    if (res.status === 400) throw new Error("Datos de registro no válidos.");
    throw new Error("Ha ocurrido un error al registrarse.");
  }

  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Email o contraseña incorrectos.");
    if (res.status === 400) throw new Error("Datos de acceso no válidos.");
    throw new Error("Ha ocurrido un error al iniciar sesión.");
  }

  return res.json();
};

export const deleteUsuario = async (id) => {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("No se pudo eliminar la cuenta.");
};
