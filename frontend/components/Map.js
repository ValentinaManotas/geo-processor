import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createIcon = () => {
  return new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [1, -34],
  });
};

const Map = ({ centroid, bounds, points }) => {
  const [mapBounds, setMapBounds] = useState(null);
  const mapRef = useRef(null); 


  useEffect(() => {
    if (bounds) {
      const { north, south, east, west } = bounds;

      if (north && south && east && west) {
        setMapBounds([
          [north, west],  
          [north, east],  
          [south, east],  
          [south, west],  
          [north, west],
        ]);
      }
    }
  }, [bounds]);

  useEffect(() => {
    if (centroid && mapRef.current) {
      mapRef.current.flyTo([centroid.lat, centroid.lng], 13, {
        animate: true,
        duration: 1,
      });
    }
  }, [centroid]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <MapContainer
        center={[centroid.lat, centroid.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[centroid.lat, centroid.lng]} icon={createIcon()}>
          <Popup>
            <b>Centroid</b><br />
            Latitude: {centroid.lat}<br />
            Longitude: {centroid.lng}
          </Popup>
        </Marker>

        {mapBounds && (
          <Polygon positions={mapBounds} color="blue">
            <Popup>
              <b>Bounds</b>
            </Popup>
          </Polygon>
        )}

        {points && points.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lng]} icon={createIcon()}>
            <Popup>
              Latitude: {point.lat}<br />
              Longitude: {point.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;