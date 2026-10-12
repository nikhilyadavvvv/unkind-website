import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Privacy from './Privacy';
import WizBidPrivacy from './WizBidPrivacy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/wizbid/privacy" element={<WizBidPrivacy />} />
      </Routes>
    </Router>
  );
}

export default App;
