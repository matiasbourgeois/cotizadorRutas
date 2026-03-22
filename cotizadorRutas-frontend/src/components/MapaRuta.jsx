
import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import { useMantineColorScheme } from '@mantine/core';

const libraries = ["places", "directions"];

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0",
};


const estiloMapaLight = [
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

const estiloMapaDark = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
];

export default function MapaRuta({ puntos, initialDirections, onRutaCalculada }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
        libraries,
    });

    const { colorScheme } = useMantineColorScheme();
    const mapStyles = colorScheme === 'dark' ? estiloMapaDark : estiloMapaLight;
    const [directions, setDirections] = useState(initialDirections || null);
    const mapRef = useRef(null);

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
            options={{ styles: mapStyles }}
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