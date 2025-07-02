import {Link} from 'react-router-dom'
const List = ({index,category}) => {
  return (
    <div>
        <Link
              key={index}
              to={`/category/${category}`}
              className="link card text-decoration-none text-black"
            >
              {category}
            </Link>
    </div>
  )
}

export default List