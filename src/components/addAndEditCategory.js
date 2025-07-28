import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImg from '../emoji/uploadImg.jpg'
import { useParams, useLocation } from 'react-router-dom';
import Loading from './otherComponent/Loading';

const AddCategory = () => {
  const token = localStorage.getItem("token");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [status, setStatus] = useState(false);
  const [imageState, setImageState] = useState(null)
  const location = useLocation()
  const [withoutRefresh, setWithoutRefresh] = useState(false)
  const initialState = {
    name: '',
    slug: '',
    description: '',
    isActive: false,
    image: ''
  };
  const [formData, setFormData] = useState(initialState)

  const fetchCategoryData = async (e) => {
    setStatus(true)
    try {
      const res = await axios.get(`${BASE_URL}/category/${id}`, { headers: { Authorization: `Bearer ${token}` } })

      setFormData(res.data.data)
      toast.success(res.data.message)
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally {
      setStatus(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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
    e.preventDefault();
    setStatus(true)
    try {

      const res = id ? await axios.put(`${BASE_URL}/category/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
        : await axios.post(`${BASE_URL}/category/`, formData, { headers: { Authorization: `Bearer ${token}` } });

      const imageId = res.data.data._id
      if (imageState) {
        const formDataImage = new FormData()
        formDataImage.append("image", imageState)
        try {

          const res = await axios.put(`${BASE_URL}/category/image/${imageId}`, formDataImage, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
          )
          setWithoutRefresh(!withoutRefresh)
          toast.success(res.data.message)
        } catch (error) {
          toast.error(error.response?.data?.message)

        }
      }
      toast.success(res.data.data.message)
      setImageState(null)
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setStatus(false)
    }
  };
  useEffect(() => {
    if (id) {
      fetchCategoryData();
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
        <h2>{id ? "update Category " : "create category"}</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug:</label>
          <input
            type="text"
            className="form-control"
            id="slug"
            name="slug"
            placeholder="Enter slug"
            value={formData.slug}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group d-flex">
          <div>
            <label htmlFor="uploadImg">
              <p>upload Image</p>
              <img src={uploadImg} alt="categoryImg" className="uploadImage " />
              {id &&
                <img
                  src={formData.image}
                  alt="no image"
                  className="uploadImage d-block"
                />
              }
            </label>
          </div>
          <div>
            <p>here</p>
            {imageState && (<div >

              <img src={URL.createObjectURL(imageState)} alt="categoryImg" className="uploadImage" />
              <span><button type="button" onClick={handleRemove} >x</button></span>
            </div>)}
            <input type="file" id="uploadImg" className="d-none" accept="image/png, image/gif, image/jpeg" onChange={handleChangeImage} />
          </div>
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}

          />
          <label className="form-check-label" htmlFor="isActive">
            Active?
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? "update  " : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
