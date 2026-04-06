import { useEffect, useState, useRef, useCallback } from "react";
import {
    GoogleMap,
    useLoadScript,
    DirectionsRenderer,
    Marker,
} from "@react-google-maps/api";
import { useMantineColorScheme } from '@mantine/core';

const libraries = ["places"];

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

export default function MapaRuta({ puntos, initialDirections, onRutaCalculada, optimizar = false, idaVuelta = false }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
        libraries,
        version: "quarterly",
    });

    const { colorScheme } = useMantineColorScheme();
    const mapStyles = colorScheme === 'dark' ? estiloMapaDark : estiloMapaLight;
    const [directions, setDirections] = useState(initialDirections || null);
    const mapRef = useRef(null);
    const prevPuntosKeyRef = useRef('');

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
        const puntosReales = puntos.filter(p => !p?.isReturn);
        if (puntosReales.length === 1) {
            map.setCenter({ lat: puntosReales[0].lat, lng: puntosReales[0].lng });
            map.setZoom(12);
        } else if (puntosReales.length > 1) {
            const bounds = new window.google.maps.LatLngBounds();
            puntosReales.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
            map.fitBounds(bounds, 50);
        } else {
            map.setCenter({ lat: -31.4167, lng: -64.1833 });
            map.setZoom(6);
        }
        prevPuntosKeyRef.current = puntosReales.map(p => `${p.lat},${p.lng}`).join('|');
    }, []);

    // Ajustar vista del mapa cuando los puntos cambian (sin bloquear el pan del usuario)
    useEffect(() => {
        if (!mapRef.current || puntos.length === 0) return;
        const puntosReales = puntos.filter(p => !p?.isReturn);
        const newKey = puntosReales.map(p => `${p.lat},${p.lng}`).join('|');
        if (newKey === prevPuntosKeyRef.current) return;
        prevPuntosKeyRef.current = newKey;

        if (puntosReales.length === 1) {
            mapRef.current.panTo({ lat: puntosReales[0].lat, lng: puntosReales[0].lng });
            mapRef.current.setZoom(12);
        } else {
            const bounds = new window.google.maps.LatLngBounds();
            puntosReales.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }));
            mapRef.current.fitBounds(bounds, 50);
        }
    }, [puntos]);

    useEffect(() => {
        if (initialDirections) {
            setDirections(initialDirections);
            return;
        }

        if (isLoaded && puntos.length >= 2) {
            const service = new window.google.maps.DirectionsService();
            const puntosReales = puntos.filter(p => !p?.isReturn);

            if (optimizar && puntosReales.length >= 3) {
                // ── MODO OPTIMIZACIÓN ──
                // Round-trip desde el origen para que Google optimice TODOS los waypoints
                const origin = { lat: puntosReales[0].lat, lng: puntosReales[0].lng };
                const waypoints = puntosReales.slice(1).map(p => ({
                    location: { lat: p.lat, lng: p.lng }, stopover: true
                }));

                service.route({
                    origin, destination: origin, waypoints,
                    travelMode: "DRIVING", optimizeWaypoints: true,
                }, (result, status) => {
                    if (status !== "OK") { console.error(`Error ruta: ${status}`); return; }

                    const legs = result.routes[0].legs;
                    const waypointOrder = result.routes[0].waypoint_order || [];

                    if (idaVuelta) {
                        // ── IDA Y VUELTA: ambos sentidos del circuito cuestan igual ──
                        // Elegimos el que empieza por el punto más cercano al origen
                        const firstLeg = legs[0].distance.value;
                        const lastDeliveryLeg = legs[legs.length - 2]?.distance?.value || 0;

                        if (firstLeg <= lastDeliveryLeg || waypointOrder.length === 0) {
                            // Sentido original OK (empieza por el cercano)
                            const distM = legs.reduce((s, l) => s + l.distance.value, 0);
                            const durS = legs.reduce((s, l) => s + l.duration.value, 0);
                            onRutaCalculada({
                                resumen: { distanciaKm: parseFloat((distM / 1000).toFixed(2)), duracionMin: Math.round(durS / 60) },
                                directions: result, waypointOrder,
                            });
                            setDirections(result);
                        } else {
                            // Invertir: ir primero al cercano, después al lejano, y volver
                            const reversedOrder = [...waypointOrder].reverse();
                            const intermedios = puntosReales.slice(1);
                            const reordenadosInv = reversedOrder.map(i => intermedios[i]);
                            const wpsInv = reordenadosInv.map(p => ({
                                location: { lat: p.lat, lng: p.lng }, stopover: true
                            }));

                            service.route({
                                origin, destination: origin, waypoints: wpsInv,
                                travelMode: "DRIVING",
                            }, (r2, s2) => {
                                if (s2 !== "OK") { console.error(`Error ruta invertida: ${s2}`); return; }
                                const legs2 = r2.routes[0].legs;
                                const distM = legs2.reduce((s, l) => s + l.distance.value, 0);
                                const durS = legs2.reduce((s, l) => s + l.duration.value, 0);
                                onRutaCalculada({
                                    resumen: { distanciaKm: parseFloat((distM / 1000).toFixed(2)), duracionMin: Math.round(durS / 60) },
                                    directions: r2, waypointOrder: reversedOrder,
                                });
                                setDirections(r2);
                            });
                        }
                    } else {
                        // ── SOLO IDA: comparar ambos sentidos del circuito ──
                        // Sentido A (Google): excluir última leg (regreso)
                        const legsA = legs.slice(0, -1);
                        const distA = legsA.reduce((s, l) => s + l.distance.value, 0);

                        // Sentido B (invertido): excluir primera leg (que sería el regreso al revés)
                        const legsB = legs.slice(1);
                        const distB = legsB.reduce((s, l) => s + l.distance.value, 0);

                        if (distA <= distB) {
                            // Sentido original de Google es mejor
                            const durA = legsA.reduce((s, l) => s + l.duration.value, 0);
                            onRutaCalculada({
                                resumen: { distanciaKm: parseFloat((distA / 1000).toFixed(2)), duracionMin: Math.round(durA / 60) },
                                directions: result, waypointOrder,
                            });
                            setDirections(result);
                        } else {
                            // Sentido invertido es mejor → pedir nueva ruta en orden correcto
                            const reversedOrder = [...waypointOrder].reverse();
                            const intermedios = puntosReales.slice(1);
                            const reordenadosInvertidos = reversedOrder.map(i => intermedios[i]);
                            const nuevosWaypoints = reordenadosInvertidos.map(p => ({
                                location: { lat: p.lat, lng: p.lng }, stopover: true
                            }));

                            // Segunda request con el orden invertido (sin round-trip, destino = último punto)
                            const lastPoint = reordenadosInvertidos[reordenadosInvertidos.length - 1];
                            service.route({
                                origin,
                                destination: { lat: lastPoint.lat, lng: lastPoint.lng },
                                waypoints: nuevosWaypoints.slice(0, -1),
                                travelMode: "DRIVING",
                            }, (result2, status2) => {
                                if (status2 !== "OK") { console.error(`Error ruta invertida: ${status2}`); return; }
                                const legs2 = result2.routes[0].legs;
                                const dist2 = legs2.reduce((s, l) => s + l.distance.value, 0);
                                const dur2 = legs2.reduce((s, l) => s + l.duration.value, 0);
                                onRutaCalculada({
                                    resumen: { distanciaKm: parseFloat((dist2 / 1000).toFixed(2)), duracionMin: Math.round(dur2 / 60) },
                                    directions: result2, waypointOrder: reversedOrder,
                                });
                                setDirections(result2);
                            });
                        }
                    }
                });
            } else {
                // ── MODO NORMAL ── sin optimización, orden del usuario
                const origenNormal = { lat: puntosReales[0].lat, lng: puntosReales[0].lng };
                const destinoNormal = idaVuelta
                    ? origenNormal  // Round-trip: volver al origen
                    : { lat: puntosReales[puntosReales.length - 1].lat, lng: puntosReales[puntosReales.length - 1].lng };
                const waypointsNormal = idaVuelta
                    ? puntosReales.slice(1).map(p => ({ location: { lat: p.lat, lng: p.lng }, stopover: true }))
                    : puntosReales.slice(1, -1).map(p => ({ location: { lat: p.lat, lng: p.lng }, stopover: true }));

                service.route({
                    origin: origenNormal,
                    destination: destinoNormal,
                    waypoints: waypointsNormal,
                    travelMode: "DRIVING",
                }, (result, status) => {
                    if (status === "OK") {
                        const legs = result.routes[0].legs;
                        const distM = legs.reduce((s, l) => s + l.distance.value, 0);
                        const durS = legs.reduce((s, l) => s + l.duration.value, 0);
                        onRutaCalculada({
                            resumen: { distanciaKm: parseFloat((distM / 1000).toFixed(2)), duracionMin: Math.round(durS / 60) },
                            directions: result, waypointOrder: null,
                        });
                        setDirections(result);
                    } else {
                        console.error(`Error al obtener la ruta: ${status}`);
                    }
                });
            }
        } else {
            setDirections(null);
        }
    }, [puntos, isLoaded, initialDirections, optimizar, idaVuelta]);


    if (loadError) return <p>Error al cargar Google Maps</p>;
    if (!isLoaded) return <p>Cargando mapa...</p>;

    const yellowIcon = {
        url: "/icons/marker-yellow.png",
        scaledSize: new window.google.maps.Size(52, 52),
        labelOrigin: new window.google.maps.Point(28, -10),
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            options={{ styles: mapStyles }}
            onLoad={onMapLoad}
        >
            {puntos.map((p, i) => {
                const esRegreso = p?.isReturn === true;
                const icon = esRegreso
                    ? { ...yellowIcon, labelOrigin: new window.google.maps.Point(28, 62) }
                    : yellowIcon;
                return (
                    <Marker
                        key={i}
                        position={{ lat: p.lat, lng: p.lng }}
                        icon={icon}
                        label={{
                            text: String.fromCharCode(65 + i),
                            color: "rgba(0, 0, 0, 0.6)",
                            fontSize: esRegreso ? "16px" : "18px",
                            fontWeight: "500",
                        }}
                    />
                );
            })}

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
                        preserveViewport: true,
                    }}
                />
            )}
        </GoogleMap>
    );
}