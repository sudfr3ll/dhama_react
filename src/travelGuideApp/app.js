import React from 'react';
import './pages/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../commonScripts/Layout.js'
import NotFoundPage from './pages/NotFoundPage.js'
import TravelGuideRegistration from './pages/travelGuideRegistration.js';
import UploadPackage from './pages/uploadPackage.js';
import Dashboard from './pages/dashboard.js';
import '../resources/css/style.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/travelGuideApp.html/*" element={<Layout />}> {/* Match the base URL */}
          <Route index element={<Dashboard />} />
          <Route path="travelGuideRegistration" element={ <TravelGuideRegistration/>} />
          <Route path="uploadPackage" element={ <UploadPackage/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
