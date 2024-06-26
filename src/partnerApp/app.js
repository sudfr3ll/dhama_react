import React from 'react';
import './pages/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../commonScripts/Layout.js';
import PartnerRegistration from './pages/partnerRegistration.js';
import NotFoundPage from './pages/NotFoundPage.js'
import Dashboard from './pages/dashboard.js';
import '../resources/css/style.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/partnerApp.html/*" element={<Layout />}> {/* Match the base URL */}
          <Route index element={<Dashboard />} />
          <Route path="partnerRegistration" element={<PartnerRegistration />} />
          <Route path="dashboard/*" element={<Dashboard />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
