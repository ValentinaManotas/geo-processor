import { useState } from 'react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latError, setLatError] = useState('');
  const [lngError, setLngError] = useState('');

  const validateDecimal = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && value.trim() !== '' && Number(value) === num;
  };

  const addPoint = () => {
    if (!lat || !lng) {
      alert('Please enter valid latitude and longitude');
      return;
    }

    if (!validateDecimal(lat)) {
      setLatError('Latitude must be a valid decimal number');
      return;
    } else {
      setLatError('');
    }

    if (!validateDecimal(lng)) {
      setLngError('Longitude must be a valid decimal number');
      return;
    } else {
      setLngError('');
    }

    setPoints([...points, { lat: parseFloat(lat), lng: parseFloat(lng) }]);
    setLat('');
    setLng('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (points.length === 0) {
      alert('Please add at least one point before submitting');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/geo/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ||  'Request error');
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.results);
      } else {
        alert(data.message || 'No results found');
      }

    } catch (error) {
      alert(error.message || 'Error connecting to the backend');
    } finally {
      setLoading(false);
    }
  };

  const clearPoints = () => {
    setPoints([]); 
    setLat('');    
    setLng(''); 
    setResult(null);
    setLatError(''); 
    setLngError(''); 
  };

  const defaultResult = {
    centroid: { lat: 10.9635, lng: -74.7963 }, 
    bounds: {
      north: 10.9860, 
      south: 10.9540, 
      east: -74.7550, 
      west: -74.8100,
    },
  };

  const mapData = result || defaultResult;

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1 className="title">Geo Processor</h1>
        <p className="subtitle">Process your geographic data and visualize it on the map</p>
      </header>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Enter latitude"
            className="input-field"
          />
          {latError && <p className="error-text">{latError}</p>}
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Enter longitude"
            className="input-field"
          />
          {lngError && <p className="error-text">{lngError}</p>}
        </div>
        
        <div className="button-group">
          <button type="button" onClick={addPoint} className="button primary">
            Add Point
          </button>
          <button type="submit" className="button secondary" disabled={loading}>
            Submit All Points
          </button>
          <button type="button" onClick={clearPoints} className="button clear">
            Clear All Points
          </button>
        </div>
      </form>

      {points.length > 0 && (
        <div className="points-list">
          <h3>Added Points:</h3>
          <ul>
            {points.map((p, idx) => (
              <li key={idx}>
                Lat: {p.lat}, Lng: {p.lng}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Map centroid={mapData.centroid} bounds={mapData.bounds} points={points} />
    </div>
  );
}