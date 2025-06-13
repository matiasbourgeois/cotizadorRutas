// src/components/BuscadorDireccion.jsx
import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function BuscadorDireccion({ onAgregar }) {
  const [direccion, setDireccion] = useState("");
  const inputRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: [],
      componentRestrictions: { country: "ar" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const nombreLugar = place.name || "";
      const direccionCompleta = place.formatted_address || "";

      // Buscar código postal en address_components
      const cpObj = place.address_components?.find(comp =>
        comp.types.includes("postal_code")
      );
      const codigoPostal = cpObj?.long_name || "";

      let nombreFinal = `${nombreLugar} – ${direccionCompleta}`;
      if (codigoPostal && !direccionCompleta.includes(codigoPostal)) {
        nombreFinal += `, CP ${codigoPostal}`;
      }

      const nuevaDireccion = {
        nombre: nombreFinal,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };


      onAgregar(nuevaDireccion);
      setDireccion("");
    });
  }, [isLoaded]);

  if (loadError) return <p>Error al cargar Google Maps</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder="Ingresá una dirección o lugar..."
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />
    </div>
  );
}
