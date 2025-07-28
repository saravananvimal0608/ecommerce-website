import React from 'react'
import { useState } from useState
import axios from axios

const addandregister = () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL
    const [imageState, setImageState] = useState(null)
    const token = localStorage.getItem("token")
    const [formData, setFormdata] = useState({
        name: '',
        slug: '',
        description: '',
        isActive: false
    })


    const handleSubmit = async () => {
        try{
        const res = id ? await axios.put(`${BASE_URL}/category/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } })
            : await axios.post(`${BASE_URL}/category/`, formData, { headers: { Authorization: `Bearer ${token}` } })

        const imageId = res.data.data._id

        if (imageState) {
            const formDataImage = new FormData()
            formDataImage.append("image", imageState)
            try {
                await axios.put(`${BASE_URL}/category/image/${imageId}`, formDataImage, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-Type": "multipart/form-data"
                    }
                })
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        toast.success(res.data.message)
        setFormdata({
            name: '',
            slug: '',
            description: '',
            isActive: true
        });
        setImageState(null)
    } catch (error) {
        return toast.error(error.response?.data?.message);
    }
};
    



return (
    <div>addandregister</div>
)
}

export default addandregister