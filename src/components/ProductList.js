import { Link } from 'react-router-dom';


const ProductList = ({ product, showImage, link, hidePrice,hideLink }) => {

  return (

  <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-3" key={product.id}>
  {hideLink ? (
    // 👉 No Link
    <div className="card h-100 text-center p-2">
      {showImage && (
        <img src={product.image} alt={product.title} className="mainImg" />
      )}
      <div className="card-body">
        <h5 className="headingLink">{product.title}</h5>
        {hidePrice && <p className="headingLink">${product.price}</p>}
      </div>
    </div>
  ) : (
    // 👉 Wrapped in Link
    <Link to={`/${link}/${product.id}`} className="text-decoration-none text-black">
      <div className="card h-100 text-center p-2">
        {showImage && (
          <img src={product.image} alt={product.title} className="mainImg" />
        )}
        <div className="card-body">
          <h5 className="headingLink">{product.title}</h5>
          {hidePrice && <p className="headingLink">${product.price}</p>}
        </div>
      </div>
    </Link>
  )}
</div>

  )
}

export default ProductList