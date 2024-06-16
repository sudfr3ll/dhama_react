
import React from 'react';

function ProductCard({ product }) {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
      <div className="card h-100">
        <img className="card-img-top" src={product.profilePicUrl} alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">Date of Birth: ${product.dob}</h5>
          <p className="card-text">Email: ${product.email}</p>
          <p className="card-text">Phone: ${product.phone}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;


