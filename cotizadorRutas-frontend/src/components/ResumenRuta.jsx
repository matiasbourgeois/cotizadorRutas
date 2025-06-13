import { MapPin, Clock } from "lucide-react";

export default function ResumenRuta({ distanciaKm, duracionMin }) {
  return (
    <div className="mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-body d-flex flex-column flex-md-row align-items-start gap-4">
          <div className="d-flex align-items-center gap-3">
            <MapPin size={32} className="text-warning" />
            <div>
              <h6 className="mb-1">Distancia estimada</h6>
              <p className="mb-0 text-muted">{distanciaKm} km</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Clock size={32} className="text-warning" />
            <div>
              <h6 className="mb-1">Duración aproximada</h6>
              <p className="mb-0 text-muted">{duracionMin} minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
