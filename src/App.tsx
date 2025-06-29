import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Player from './pages/Player';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<Player />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Add more routes */}
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
