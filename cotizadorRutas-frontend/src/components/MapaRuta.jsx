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

export default function MapaRuta({ puntos, optimizar, onOptimizarOrden, onDatosRuta, recalculo }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
        libraries,
    });

    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!isLoaded || puntos.length < 2) {
            setDirections(null);
            return;
        }

        const service = new window.google.maps.DirectionsService();

        // Si la orden es optimizar, hacemos el proceso de 2 pasos
        if (optimizar) {
            // PASO 1: Pedir solo el ORDEN ÓPTIMO con el truco de ida y vuelta
            const requestOrden = {
                origin: { lat: puntos[0].lat, lng: puntos[0].lng },
                destination: { lat: puntos[0].lat, lng: puntos[0].lng },
                waypoints: puntos.slice(1).map(p => ({ location: { lat: p.lat, lng: p.lng }, stopover: true })),
                travelMode: "DRIVING",
                optimizeWaypoints: true,
            };

            service.route(requestOrden, (result, status) => {
                if (status === "OK" && result.routes[0]?.waypoint_order) {
                    const orden = result.routes[0].waypoint_order;
                    const puntosIntermedios = puntos.slice(1);
                    const puntosOptimizados = [
                        puntos[0],
                        ...orden.map((i) => puntosIntermedios[i]),
                    ];
                    // Le pasamos el nuevo orden al componente padre. Esto causará un re-render
                    // y el useEffect se volverá a ejecutar, pero esta vez con optimizar=false
                    onOptimizarOrden(puntosOptimizados);
                } else {
                     console.error("No se pudo obtener el orden optimizado:", status);
                     onOptimizarOrden(puntos); // Devolvemos el orden original en caso de error
                }
            });
        } else {
            // PASO 2: Calcular y dibujar la ruta con el orden de puntos actual (sea el original o el ya optimizado)
            const requestRuta = {
                origin: { lat: puntos[0].lat, lng: puntos[0].lng },
                destination: { lat: puntos[puntos.length - 1].lat, lng: puntos[puntos.length - 1].lng },
                waypoints: puntos.slice(1, -1).map(p => ({ location: { lat: p.lat, lng: p.lng }, stopover: true })),
                travelMode: "DRIVING",
                optimizeWaypoints: false, // Nunca optimizamos en este paso, solo dibujamos
            };

            service.route(requestRuta, (result, status) => {
                if (status === "OK") {
                    const distanciaMetros = result.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0);
                    const duracionSegundos = result.routes[0].legs.reduce((sum, leg) => sum + leg.duration.value, 0);
                    const distanciaKm = parseFloat((distanciaMetros / 1000).toFixed(2));
                    const duracionMin = Math.round(duracionSegundos / 60);

                    // Actualizamos el resumen y el mapa con los datos CORRECTOS del viaje de solo ida
                    onDatosRuta({ distanciaKm, duracionMin });
                    setDirections(result);
                } else {
                    console.error("Error al dibujar la ruta final:", status);
                }
            });
        }

    }, [puntos, optimizar, recalculo, isLoaded, onDatosRuta, onOptimizarOrden]);


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