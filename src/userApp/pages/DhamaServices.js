import React from "react";
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import travelGuideImage from '../../resources/travelguide.jpg';
import purohitImage from '../../resources/purohit.jpg';

const DhamaServices = () => {
  return (
    
      <div className='container'>
        <h1 className='text-center mt-5'>Dhama Services</h1>
     <div className='row mt-5'>
    
        
          <Link to='/searchPurohit' className="col-lg-3 col-md-6 col-sm-6 mb-4 ">
            <div className="card h-100">
              <img className="card-img-top p-2" src={purohitImage} alt="Search Purohits Nearby" />
              <div className="card-body">
                <h5 className="card-title text-center">Search Purohits Nearby</h5>
              </div>
            </div>
          </Link>
      
       
          <Link to='/searchTourGuides' className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="card h-100">
              <img className="card-img-top p-2" src={travelGuideImage} alt="Search Tour Guides Nearby" />
              <div className="card-body">
                <h5 className="card-title text-center">Search Tour Guides Nearby</h5>
              </div>
            </div>
          </Link>
        </div>
    
      </div>
      
  );
}

export default DhamaServices;
