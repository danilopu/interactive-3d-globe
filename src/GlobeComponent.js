import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl';
import './GlobeComponent.css'; // Optional CSS for styling and animations
import geoJsonData from './custom.geo.json'; // Import GeoJSON data

// Constants for arc and ring settings
const ARC_REL_LEN = 0.4; // Relative to whole arc
const FLIGHT_TIME = 1000; // Time for arc animation
const RINGS_MAX_R = 5; // Maximum radius for rings
const RING_PROPAGATION_SPEED = 5; // Speed for ring propagation

function GlobeComponent() {
  const [countries, setCountries] = useState({ features: [] });
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);
  const prevCoords = useRef({ lat: 0, lng: 0 }); // Keep track of previous coordinates

  useEffect(() => {
    setCountries(geoJsonData); // Set GeoJSON data
  }, []);

  const emitArc = useCallback(({ lat: endLat, lng: endLng }) => {
    const { lat: startLat, lng: startLng } = prevCoords.current;
    prevCoords.current = { lat: endLat, lng: endLng };

    // Create and remove arcs and rings with checks for null/undefined
    const arc = { startLat, startLng, endLat, endLng };
    if (arc) {
      setArcsData((curArcsData) => [...curArcsData, arc]);
      setTimeout(() => setArcsData((curArcsData) => curArcsData.filter((d) => d !== arc)), FLIGHT_TIME * 2);
    }

    const srcRing = { lat: startLat, lng: startLng };
    if (srcRing) {
      setRingsData((curRingsData) => [...curRingsData, srcRing]);
      setTimeout(() => setRingsData((curRingsData) => curRingsData.filter((r) => r !== srcRing)), FLIGHT_TIME * ARC_REL_LEN);
    }

    setTimeout(() => {
      const targetRing = { lat: endLat, lng: endLng };
      if (targetRing) {
        setRingsData((curRingsData) => [...curRingsData, targetRing]);
        setTimeout(() => setRingsData((curRingsData) => curRingsData.filter((r) => r !== targetRing)), FLIGHT_TIME * ARC_REL_LEN);
      }
    }, FLIGHT_TIME);
  }, []);

  const countryColorMap = useRef({}); // Store consistent country colors

  const getCountryColor = (countryName) => {
    if (countryColorMap.current[countryName]) {
      return countryColorMap.current[countryName];
    }
    
    const newColor = `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`;
    countryColorMap.current[countryName] = newColor;
    return newColor;
  };

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg" // Dark mode texture
      onGlobeClick={emitArc} // Event handler for creating arcs
      hexPolygonsData={countries.features} // GeoJSON data for hexed polygons
      hexPolygonResolution={3} // Hexagon resolution
      hexPolygonMargin={0.3} // Margin between hexagons
      hexPolygonUseDots={true} // Use dots instead of solid hexagons
      hexPolygonColor={(d) => getCountryColor(d.properties.name)} // Consistent colors for countries
      hexPolygonLabel={({ properties: d }) => `
        <b>${d.name} (${d.ISO_A2})</b> <br />
        Population: <i>${d.POP_EST}</i>
      `}
      arcsData={arcsData} // Data for arcs
      arcColor={() => 'darkOrange'} // Color for arcs
      arcDashLength={ARC_REL_LEN} // Arc dash length
      arcDashGap={2} // Gap between arc dashes
      arcDashInitialGap={1} // Initial gap for arcs
      arcDashAnimateTime={FLIGHT_TIME} // Animation time for arcs
      ringsData={ringsData} // Data for rings
      ringColor={(t) => `rgba(255, 100, 50, ${1 - t})`} // Color for rings with proper parameter
      ringMaxRadius={RINGS_MAX_R} // Maximum radius for rings
      ringPropagationSpeed={RING_PROPAGATION_SPEED} // Speed for ring propagation
    />
  );
}

export default GlobeComponent; // Correct export
