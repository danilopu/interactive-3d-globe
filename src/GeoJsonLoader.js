import * as THREE from 'three';

// Custom function to convert latitude/longitude to 3D coordinates on a sphere
function latLonToXYZ(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (180 - lon) * (Math.PI / 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

// Custom function to load GeoJSON data and convert to 3D coordinates
function loadGeoJSON(geoJson, radius) {
  const points = [];

  geoJson.features.forEach((feature) => {
    if (feature.geometry && feature.geometry.type === 'Polygon') {
      feature.geometry.coordinates[0].forEach(([lon, lat]) => {
        const point = latLonToXYZ(lat, lon, radius);
        points.push(point);
      });
    } else if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach((polygon) => {
        polygon[0].forEach(([lon, lat]) => {
          const point = latLonToXYZ(lat, lon, radius);
          points.push(point);
        });
      });
    }
  });

  return points;
}

export { loadGeoJSON }; // Export the custom loader
