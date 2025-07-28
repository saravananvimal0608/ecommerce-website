import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Loading from './otherComponent/Loading'
import Table from 'react-bootstrap/Table';
import { TiExportOutline } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const ViewCategory = () => {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const [categories, setCategories] = useState([])
    const [status, setStatus] = useState(true)
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token")
    const Navigate = useNavigate()

    // const categoryDelete = categories.find(categories => categories.id === confirmDeleteId)

    const handleDeleteClick = (id) => {
        setConfirmDeleteId(id);
    }


    const fetchCategory = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/category/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategories(res.data.data)
            console.log(res.data.data);

            toast.success(res.data.message)
            setStatus(false)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    useEffect(() => {
        fetchCategory();
    }, [])


    const handleConfirmDelete = async () => {
        try {
            const res = await axios.delete(`${BASE_URL}/category/${confirmDeleteId}`, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(res.data.message)
            fetchCategory()
            setConfirmDeleteId(null)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(categories)
        //result.source.index = drag index 
        const [reorderedItem] = items.splice(result.source.index, 1);
        //result.destination.index = drop index 
        items.splice(result.destination.index, 0, reorderedItem)
        setCategories(items)

        //sending category id and order id to db
        const orderedCategories = items.map((category, index) => ({
            _id: category._id,
            order: index + 1,
        }))
        try {
            const res = await axios.put(`${BASE_URL}/category`, { orderedCategories }, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    //for updating status
    const handleStatusChange = async (status, id) => {
        try {
            const selectedCategory = categories.find(cat => cat._id === id);

            if (!selectedCategory) {
                toast.error("Category not found");
                return;
            }

            const res = await axios.put(
                `${BASE_URL}/category/${id}`,
                {
                    name: selectedCategory.name,
                    slug: selectedCategory.slug,
                    description: selectedCategory.description,
                    isActive: status === "active"
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data.message);
            fetchCategory();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="container py-3">
            {status && (
                <div className="load position-absolute w-100 h-100vh top-0 d-flex justify-content-center align-items-center">
                    <Loading />
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 className="mb-0">Category List</h2>

                {confirmDeleteId && (
                    <Modal show={!!confirmDeleteId} onHide={() => setConfirmDeleteId(null)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Category</Modal.Title>
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

                <Link to="/addcategory" className="btn btn-success">
                    + Add Category
                </Link>
            </div>

            <div className="table-responsive d-flex justify-content-between">
                {/* to allow drag and drop whenever drop handleDrag function is calling */}
                <DragDropContext onDragEnd={handleDragEnd} >
                    {/* ?? */}
                    <Droppable droppableId="categories" >
                        {(provided) => (
                            <Table className="table fixed-table" {...provided.droppableProps} ref={provided.innerRef}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, i) => (
                                        <Draggable key={category._id} draggableId={category._id} index={i}>
                                            {(provided) => (
                                                <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        {category.image ? (
                                                            <div className="d-flex gap-4">
                                                                <img src={category.image} alt="categoryimg" className="uploadImage" />
                                                                <div className="texthide">
                                                                    <Link to={`${category.slug}`} target="_blank" className="linkCategory">
                                                                        {category.name}
                                                                        <TiExportOutline />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span>No img</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="texthide">{category.description}</div>
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={category.isActive ? "active" : "inactive"}
                                                            onChange={(e) => handleStatusChange(e.target.value, category._id)}
                                                            className="form-select"
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                    </td>
                                                    <td className="threeDot position-relative">
                                                        <BsThreeDotsVertical />


                                                        <div className="hidetd position-absolute" >
                                                            <div className="d-flex align-items-center mb-2 pb-1 pt-2 ps-1" onClick={() => Navigate(`/updatecategory/${category._id}`)}>
                                                                <FaEdit className="me-1" />
                                                                <span className="ps-1 text-black text-decoration-none" >Edit</span>

                                                            </div>
                                                            <div className="d-flex align-items-center ps-1" onClick={() => handleDeleteClick(category._id)}>
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
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </tbody>
                            </Table>
                        )}
                    </Droppable >
                </DragDropContext >

            </div>
        </div >
    )
}


export default ViewCategory