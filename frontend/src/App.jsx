import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home'
import UrlDataDisplay from './component/UrlDataDisplay'
import About from './component/About'
import Service from './component/Service.jsx'

function App() {
  const [url, setUrl] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home url={url} setUrl={setUrl} />} />
        <Route path="/display-data" element={<UrlDataDisplay url={url} />} />
        <Route path="/about" element={<About/>} />
        <Route path="/service" element={<Service/>} />
      </Routes>
    </Router>
  );
}

export default App;
