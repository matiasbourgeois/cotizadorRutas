// src/services/nominatim.js
export async function buscarDireccion(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=ar&limit=5`
  );
  return await res.json();
}
