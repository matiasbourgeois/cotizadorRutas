// ruta: src/components/BuscadorDireccion.jsx

import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { TextInput, rem } from "@mantine/core";
import { MapPin } from "lucide-react";

const libraries = ["places"];

export default function BuscadorDireccion({ onAgregar }) {
  const [direccion, setDireccion] = useState("");
  const inputRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
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
      const cpObj = place.address_components?.find(comp => comp.types.includes("postal_code"));
      const codigoPostal = cpObj?.long_name || "";

      let nombreFinal = `${nombreLugar} – ${direccionCompleta}`;
      if (codigoPostal && !direccionCompleta.includes(codigoPostal)) {
        nombreFinal += `, CP ${codigoPostal}`;
      }

      onAgregar({
        nombre: nombreFinal,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
      setDireccion("");
    });
  }, [isLoaded, onAgregar]);

  if (loadError) return <p>Error al cargar Google Maps</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <TextInput
      ref={inputRef}
      label="Agregar Dirección"
      description="Ingresa una dirección o nombre de lugar y presiona Enter."
      placeholder="Buscar en Google Maps..."
      value={direccion}
      onChange={(e) => setDireccion(e.target.value)}
      leftSection={<MapPin style={{ width: rem(16), height: rem(16) }} />}
      mb="lg"
    />
  );
}