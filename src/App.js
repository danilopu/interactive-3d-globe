import React from 'react';
import GlobeComponent from './GlobeComponent'; // Import the correct GlobeComponent
import './App.css'; // Optional CSS for styling

function App() {
  return (
    <div className="App">
      <header>
        <h1>3D Globe with three.js</h1>
      </header>
      <main>
        <GlobeComponent /> {/* Use the imported component */}
      </main>
    </div>
  );
}

export default App; // Correct export statement