import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import Select from 'react-select'
import uploadImg from '../emoji/uploadImg.jpg'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Loading from './otherComponent/Loading';

const AddEditProduct = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL
  const token = localStorage.getItem("token")
  const { id } = useParams()
  const [categoryList, setCategoryList] = useState([])
  const [imageState, setImageState] = useState(null)
  const location = useLocation()
  const [status, setStatus] = useState(true)
  const navigate = useNavigate()
  const [withoutRefresh, setWithoutRefresh] = useState(false)
  const initialState = {
    name: '',
    slug: '',
    description: '',
    inStock: true,
    price: '',
    category: [],
    image: ''
  }
  const [formData, setFormData] = useState(initialState)


  const fetchProductData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/product/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setFormData(res.data.data)
      toast.success(res.data.message)
      setStatus(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally {
      setStatus(false)
    }
  }

  //category select option
  const categoryOptions = categoryList.map(cat => ({
    value: cat._id,
    label: cat.name
  }))

  // fetch all categories api from category

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/category`, { headers: { Authorization: `Bearer ${token}` } })

      setCategoryList(res.data.data)
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleChangeImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageState(file)
      e.target.value = null
    }
  }

  const handleRemove = () => {
    setImageState(null)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = {
      ...formData,

      // converting edit and add category for display **
      category: formData.category.map((item) =>
        typeof item === 'object' && item._id ? item._id : item
      ),
      price: Number(formData.price)
    }

    try {
      const res = id ? await axios.put(`${BASE_URL}/product/${id}`, dataToSend, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(`${BASE_URL}/product`, dataToSend, { headers: { Authorization: `Bearer ${token}` } })

      const imageId = res.data.data._id

      if (imageState) {
        const formDataImage = new FormData()
        formDataImage.append("image", imageState)

        try {
          const res = await axios.put(`${BASE_URL}/product/image/${imageId}`, formDataImage, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } })

          setWithoutRefresh(!withoutRefresh)
          toast.success(res.data.message)
        }
        catch (error) {
          toast.error(error.response.data.message)
        }
      }
      toast.success(res.data.message)
      { !id && navigate('/viewproduct') }
      setImageState(null)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }


  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {

    if (id) {
      fetchProductData()
    }
    if (!id) {
      setStatus(false)
    }
  }, [id, withoutRefresh])

  useEffect(() => {
    setFormData(initialState)
  }, [location])

  return (
    <div>
      {status && (
        <div className="load position-absolute w-100 h-100vh top-0 justify-content-center align-items-center ">
          <Loading />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h2>{id ? "edit product" : " add product"}</h2>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">slug:</label>
          <input
            type="text"
            name="slug"
            className="form-control"
            value={formData.slug}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">description:</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputCategory">price:</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) =>
                setFormData({ ...formData, inStock: e.target.checked })
              }
            />
            In Stock
          </label>
        </div>


        <div className="form-group">
          <label htmlFor="category">Category:</label>

          <Select
            isMulti
            name="category"
            options={categoryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Choose categories"
            value={categoryOptions?.filter(opt =>
              formData?.category?.some(cat => typeof cat === 'object' ? cat._id === opt.value : cat === opt.value)
            )}
            onChange={(selectedOptions) => {
              const selectedIds = selectedOptions?.map(opt => opt.value)
              setFormData({ ...formData, category: selectedIds })
            }}
          />
        </div>

        <div className="form-group d-flex gap-2">
          <div>
            <label htmlFor="uploadImg">
              <p>upload Image</p>
              <img src={uploadImg} alt="upload img" className="uploadImage" />
              {id &&
                <img src={formData.image} alt="no image" className="uploadImage d-block" />
              }
            </label>
          </div>
          <div>
            <p>here</p>
            {imageState && (
              <div>
                <img src={URL.createObjectURL(imageState)} alt="productImg" className="uploadImage" />
                <span><button type="button" onClick={handleRemove} >x</button></span>
              </div>
            )}
            <input type="file" id="uploadImg" className="d-none" accept="image/png, image/gif, image/jpeg" onChange={handleChangeImage} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">{id ? "update" : "submit"}</button>
      </form>
    </div>
  )
}

export default AddEditProduct