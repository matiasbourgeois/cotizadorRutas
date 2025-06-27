// ruta: src/components/MapaRuta.jsx

import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";

const libraries = ["places", "directions"];

const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "12px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
};

const estiloMapaGrisElegante = [
    { elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#eeeeee" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#dddddd" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#cccccc" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", stylers: [{ color: "#d0d0d0" }] },
];

// ✅ PASO 1: La función ahora recibe las nuevas props que definimos antes
export default function MapaRuta({ puntos, initialDirections, onRutaCalculada }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
        libraries,
    });

    // ✅ PASO 2: El estado local se inicializa con el valor que viene del contexto (initialDirections)
    const [directions, setDirections] = useState(initialDirections || null);
    const mapRef = useRef(null);

    // ✅ PASO 3: Reemplaza tu 'useEffect' completo por este. Es más simple y robusto.
    useEffect(() => {
        // Condición 1: Si ya tenemos una ruta en el estado (porque venía del contexto),
        // la dibujamos y no hacemos nada más.
        if (initialDirections) {
            setDirections(initialDirections);
            return;
        }

        // Condición 2: Si NO teníamos una ruta guardada, pero hay puntos suficientes
        // y el mapa está listo, procedemos a calcularla.
        if (isLoaded && puntos.length >= 2) {
            const service = new window.google.maps.DirectionsService();
            const requestRuta = {
                origin: { lat: puntos[0].lat, lng: puntos[0].lng },
                destination: { lat: puntos[puntos.length - 1].lat, lng: puntos[puntos.length - 1].lng },
                waypoints: puntos.slice(1, -1).map(p => ({ location: { lat: p.lat, lng: p.lng }, stopover: true })),
                travelMode: "DRIVING",
            };

            service.route(requestRuta, (result, status) => {
                if (status === "OK") {
                    const distanciaMetros = result.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0);
                    const duracionSegundos = result.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0);
                    
                    // Devolvemos tanto el resumen como el objeto 'directions' para guardarlo en el contexto
                    onRutaCalculada({
                        resumen: {
                            distanciaKm: parseFloat((distanciaMetros / 1000).toFixed(2)),
                            duracionMin: Math.round(duracionSegundos / 60),
                        },
                        directions: result
                    });

                    setDirections(result); // Actualizamos el estado local para dibujar en el mapa
                } else {
                    console.error(`Error al obtener la ruta: ${status}`);
                }
            });
        } else {
            // Si no se cumple ninguna condición (ej: se eliminan los puntos), limpiamos la ruta.
            setDirections(null);
        }
    // ✅ PASO 4: El array de dependencias ahora solo necesita saber si los puntos cambian o si el mapa cargó.
    }, [puntos, isLoaded, initialDirections]);


    if (loadError) return <p>Error al cargar Google Maps</p>;
    if (!isLoaded) return <p>Cargando mapa...</p>;

    const yellowIcon = {
        url: "/icons/marker-yellow.png",
        scaledSize: new window.google.maps.Size(52, 52),
        labelOrigin: new window.google.maps.Point(28, -10),
    };

    const center = puntos[0]
        ? { lat: puntos[0].lat, lng: puntos[0].lng }
        : { lat: -31.4167, lng: -64.1833 };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={(map) => (mapRef.current = map)}
            options={{ styles: estiloMapaGrisElegante }}
        >
            {puntos.map((p, i) => (
                <Marker
                    key={i}
                    position={{ lat: p.lat, lng: p.lng }}
                    icon={yellowIcon}
                    label={{
                        text: String.fromCharCode(65 + i),
                        color: "rgba(0, 0, 0, 0.6)",
                        fontSize: "18px",
                        fontWeight: "500",
                    }}
                />
            ))}
            {/* ✅ PASO 5: No hay cambios aquí, pero ahora 'directions' se rellena de forma fiable */}
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        polylineOptions: {
                            strokeColor: "#ffcc00",
                            strokeOpacity: 0.5,
                            strokeWeight: 3.5,
                        },
                        suppressMarkers: true,
                    }}
                />
            )}
        </GoogleMap>
    );
}