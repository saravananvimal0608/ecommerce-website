import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../../ApiIntegration/UserList'
import Loader from './Loader'

const Call = () => {
  const [categories, setCategories] = useState([]);
  const { category } = useParams();
  const [status, setStatus] = useState(false)

  useEffect(() => {
    axios.get(`https://fakestoreapi.in/api/products/category?type=${category}`)
      .then(res => {
        setCategories(res.data.products);
        setStatus(true)
      })
      .catch(err => {
        console.log('error:', err);
      });
  }, [category]);
  console.log(categories);

  return (
    <div className="container mt-4">
      {!status ? (
        <Loader />
      ) : (
        <>
          <h2>Category: {category}</h2>
          <div className="row">
            {categories.map(product => (
              <ProductList product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Call;
