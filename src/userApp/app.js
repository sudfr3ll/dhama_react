import React from 'react';
import './pages/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../commonScripts/Layout.js'
import Home from './pages/Home.js'
import '../resources/css/style.css';
import NotFoundPage from './pages/NotFoundPage.js';
import SearchPurohit from './pages/searchPurohit.js';
import DhamaServices from './pages/DhamaServices.js';




function App() {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="searchPurohit" element={<SearchPurohit />} />
          <Route path="dhamaServices" element={<DhamaServices />} / >
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
