const BASE_URL = "/api/mochilas";

export const getMochilas = async (usuarioId) => {
  const response = await fetch(`${BASE_URL}?usuarioId=${usuarioId}`);
  if (!response.ok) throw new Error("No se pudieron cargar las mochilas");
  return await response.json();
};

export const createMochila = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("No se pudo crear la mochila");
  return await response.json();
};

export const patchMochila = async (id, cambios) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
  if (!response.ok) throw new Error("No se pudo actualizar la mochila");
  return await response.json();
};

export const deleteMochila = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("No se pudo eliminar la mochila");
};

export const getMochilasPublicas = async () => {
  const response = await fetch(`${BASE_URL}/publicas`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las mochilas públicas");
  }

  return await response.json();
};

export const getMochilaPublicaDetalle = async (id) => {
  const response = await fetch(`${BASE_URL}/publicas/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo cargar el detalle de la mochila pública");
  }

  return await response.json();
};