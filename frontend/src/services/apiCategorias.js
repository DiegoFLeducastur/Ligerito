const BASE_URL = "http://localhost:8080/api/categorias";

export const getCategorias = async (mochilaId) => {
  const response = await fetch(`${BASE_URL}?mochilaId=${mochilaId}`);
  if (!response.ok) throw new Error("No se pudieron cargar las categorías");
  return await response.json();
};

export const createCategoria = async (data) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("No se pudo crear la categoría");
  return await response.json();
};

export const deleteCategoria = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("No se pudo eliminar la categoría");
};
