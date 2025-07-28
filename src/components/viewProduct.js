import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { TiExportOutline } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaSync } from "react-icons/fa";
import Loading from './otherComponent/Loading';


const ViewProduct = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const [products, setProducts] = useState([])
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [status, setStatus] = useState(true)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)

    const [filters, setFilters] = useState({
        name: '',
        minPrice: '',
        maxPrice: '',
        inStock: '',
    });

    const handleChange = (e) => {
        setCurrentPage(1)
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const resetFilter = () => {
        setFilters({
            name: "",
            minPrice: "",
            maxPrice: "",
            inStock: ""
        });
        setCurrentPage(1);
    };


    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id)
    }

    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`${BASE_URL}/product/${confirmDeleteId}`, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(res.data.message)
            fetchProduct()
            setConfirmDeleteId(null)
        }
        catch (error) {
            toast.error(error.response.data.message)
        }
    }


    const fetchProduct = async () => {

        try {
            const { name, minPrice, maxPrice, inStock } = filters;

            const res = await axios.get(`${BASE_URL}/product`, {
                params: {
                    page: currentPage,
                    limit: 10,
                    name,
                    minPrice,
                    maxPrice,
                    inStock,
                },
                headers: { Authorization: `Bearer ${token}` }
            })


            setProducts(res.data.data.data)
            setTotalPage(res.data.data.totalPages)
            setStatus(false)
            // toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        fetchProduct(currentPage);
    }, [currentPage, filters])

    return (
        <div className="position-relative">
            {status && (
                <div className="load position-absolute w-100 h-100vh top-0 justify-content-center align-items-center ">
                    <Loading />
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 className="mb-0">product List</h2>


                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                    }}
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={filters.name}
                        onChange={handleChange}
                        name="name"
                    />
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={handleChange}
                        name="minPrice"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        name="maxPrice"
                    />
                    <select
                        name="inStock"
                        onChange={handleChange}
                        value={filters.inStock}
                    >
                        <option value="">All</option>
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                    </select>



                    <button type="button" onClick={resetFilter}><FaSync /></button>

                </form>



                {confirmDeleteId && (
                    <Modal show={!!confirmDeleteId} onHide={() => setConfirmDeleteId(null)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete this category?</p>
                        </Modal.Body>
                        <Modal.Footer>

                            <Button variant="primary" onClick={() => setConfirmDeleteId(null)}>No</Button>
                            <Button variant="secondary" onClick={handleConfirmDelete}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                )}

                <Link to="/addproduct" className="btn btn-success">
                    + Add product
                </Link>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>product</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, i) => (
                        <tr key={product._id}>
                            <th scope="row">{i + 1}</th>
                            <td>
                                {product.image ? (
                                    <div className="d-flex gap-4">
                                        <img src={product.image} alt="productimg" className="uploadImage" />
                                        <div className="texthide">
                                            <Link to={`${product.slug}`} target="_blank" className="linkCategory">
                                                {product.name}
                                                <TiExportOutline />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <span>No img</span>
                                )}
                            </td>
                            <td>
                                <div className="texthide">{product.description}</div>
                            </td>
                            <td>
                                <select
                                    value={product.inStock ? "active" : "inactive"}
                                    className="form-select"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select></td>
                            <td>
                                {product.price}
                            </td>
                            <td className="threeDot position-relative">
                                <BsThreeDotsVertical />

                                <div className="hidetd1 position-absolute">
                                    <div className="d-flex align-items-center mb-2 pb-1 pt-2 ps-1" onClick={() => navigate(`/updateProduct/${product._id}`)}>
                                        <FaEdit className="me-1" />
                                        <span className="ps-1 text-black text-decoration-none" >Edit</span>
                                    </div>

                                    <div className="d-flex align-items-center ps-1" onClick={() => handleDeleteClick(product._id)}>
                                        <RiDeleteBin6Line className="me-1" />
                                        <p
                                            className="ps-1 text-black m-0 p-0"
                                        >
                                            Delete
                                        </p>
                                    </div>

                                </div>

                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3 gap-2">
                <button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span className="align-self-center">Page {currentPage} of {totalPage}</span>

                <button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
                    disabled={currentPage === totalPage}
                >
                    Next
                </button>
            </div>

        </div>

    )
}

export default ViewProduct