
import './pages/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout.js'
import Home from './pages/Home.js'
import React from 'react';


function App() {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
