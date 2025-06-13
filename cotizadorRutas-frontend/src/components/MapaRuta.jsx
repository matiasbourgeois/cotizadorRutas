import React, { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";

const libraries = ["places"];

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
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [directions, setDirections] = useState(null);
    const mapRef = useRef(null);
    ;
    const [distanciaKm, setDistanciaKm] = useState(null);

    useEffect(() => {
        if (puntos.length < 2) {
            setDirections(null);
            return;
        }

        const origen = puntos[0];
        const destino = puntos[puntos.length - 1];
        const puntosIntermedios = puntos.slice(1, -1);

        const waypoints = puntosIntermedios.map((p) => ({
            location: { lat: p.lat, lng: p.lng },
            stopover: true,
        }));

        const request = {
            origin: { lat: origen.lat, lng: origen.lng },
            destination: { lat: destino.lat, lng: destino.lng },
            travelMode: "DRIVING",
            waypoints,
            optimizeWaypoints: optimizar,
        };

        const service = new window.google.maps.DirectionsService();
        service.route(request, (result, status) => {
            if (status === "OK") {
                // Calcular distancia total en km
                const distanciaMetros = result.routes[0].legs.reduce(
                    (sum, leg) => sum + leg.distance.value,
                    0
                );
                const duracionSegundos = result.routes[0].legs.reduce(
                    (sum, leg) => sum + leg.duration.value,
                    0
                );

                const distanciaKm = (distanciaMetros / 1000).toFixed(2);
                const duracionMin = Math.round(duracionSegundos / 60);

                // Propagar al padre
                if (onDatosRuta) {
                    onDatosRuta({ distanciaKm, duracionMin });
                }

                setDistanciaKm(distanciaKm);

                setDirections(result);

                if (
                    optimizar &&
                    result.routes[0]?.waypoint_order &&
                    onOptimizarOrden
                ) {
                    const orden = result.routes[0].waypoint_order;
                    const intermedios = puntos.slice(1, -1);

                    const puntosOptimizados = [
                        puntos[0], // origen fijo
                        ...orden.map((i) => intermedios[i]),
                        puntos[puntos.length - 1], // destino fijo
                    ];

                    const ordenActual = puntos.map((p) => `${p.lat},${p.lng}`).join("|");
                    const nuevoOrden = puntosOptimizados.map((p) => `${p.lat},${p.lng}`).join("|");

                    if (ordenActual !== nuevoOrden) {
                        onOptimizarOrden(puntosOptimizados);
                    }
                }
            } else {
                console.error("Error en DirectionsService:", status);
            }
        });
    }, [puntos, optimizar, recalculo]);

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
        <div className="my-4">
            <h5 className="mb-3">Ruta estimada en el mapa</h5>
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
        </div>
    );
}
