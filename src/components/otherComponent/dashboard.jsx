import { useEffect, useState } from 'react';
import axios from 'axios';

import Loader from './Loader.js'



const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get("https://fakestoreapi.in/api/products")
      .then(res => {

        setProducts(res.data.products);
        setStatus(false)
        setError(null)
      })
      .catch(err => {
        setStatus(true)
        setError(err.message || "Something went wrong ");

      });
  }, []);

  return (
    <div>
      <h2 className="heading1">Dashboard</h2>

      <div className="d-flex justify-content-start">
        <div className="d-flex flex-wrap gap-3 mb-2 ">
        
        </div>
      </div>

      {
        status && error ? (
          <div className="alert alert-danger">
            <h5>Error: {error}</h5>
          </div>
        ) : status ? (
          <Loader />
        ) : (
          <div className="row">
            {products?.length ? products.map(product => (
              // <ProductList product={product} link={"project"} />
              <p></p>

            )) : <p>no data found</p>
            }
          </div>

        )}
    </div>
  );
};

export default Dashboard;
