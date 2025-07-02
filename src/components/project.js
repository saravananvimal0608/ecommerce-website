import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProductList from './ProductList'
import Loader from './Loader'

const Project = () => {
  const [product, setProduct] = useState({});
  const [status, setStatus] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    axios.get(`https://fakestoreapi.in/api/products/${id}`)
      .then(res => {
        setProduct(res.data.product);
        setStatus(true)
      })
      .catch(err => {
        console.error('Error:', err);
      });
  }, [id]);

  return (

    <div className="container mt-4">
      {!status ? (
        <Loader/>
      ) : (
        <ProductList product={product}  hideLink/>
      )}
    </div>

  );
};

export default Project;
