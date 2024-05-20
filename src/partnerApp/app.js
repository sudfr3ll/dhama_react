import React from 'react';
import './pages/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout.js'
import Home from './pages/Home.js'
import PartnerRegistration from './pages/partnerRegistration.js';
import NotFoundPage from './pages/NotFoundPage.js'
import PartnerProfile from './pages/partnerProfile.js';
import TravelGuideRegistration from './pages/travelGuideRegistration.js';
import PrasadamProviderRegistration from './pages/prasadamProviderRegistration.js';
import PurohitRegistration from './pages/purohitRegistration.js';
import Dashboard from './pages/dashboard.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/partnerApp.html/*" element={<Layout />}> {/* Match the base URL */}
          <Route index element={<Home />} />
          <Route path="partnerRegistration" element={<PartnerRegistration />} />
          <Route path="partnerProfile" element={<PartnerProfile />} />
          <Route path="purohitRegistration" element={<PurohitRegistration />} />
          <Route path="travelGuideRegistration" element={<TravelGuideRegistration />} />
          <Route path="prasadamProviderRegistration" element={<PrasadamProviderRegistration />} />
          <Route path="partnerProfile" element={<PartnerProfile />} />
          <Route path="dashboard/*" element={<Dashboard />}/>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
