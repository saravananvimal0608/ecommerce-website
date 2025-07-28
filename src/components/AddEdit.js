import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from './otherComponent/Loading';

const AddEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(true);
    const [showPassword, setShowPassword] = useState(false)
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [errors, setErrors] = useState({});
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const handleToggle = () => {
        setShowPassword(!showPassword)
    }
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        password: '',
        email: '',
        address: [{ line: "" }],
        description: '',
        mobile: '',
        avatar: ''
    });



    useEffect(() => {
        if (!id) {
            setStatus(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BASE_URL}/user/getuserid/${id}`, { headers: { Authorization: `Bearer ${token}` } });


                setFormData({
                    ...res.data.data,
                    _id: res.data.data._id,
                    address: Array.isArray(res.data.data.address)
                        ? res.data.data.address
                        : [{ line: "" }]
                });

                //edit photo value
                if (res.data.data.avatar) {
                    setPreview(res.data.data.avatar);
                }
                toast.success(res.data.message);

                setStatus(false);
            } catch (error) {
                navigate("/error");
                toast.error(error.response?.data?.message || "Error fetching user");
                setStatus(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validate(name, value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEditMode = !!formData._id;
        const newErrors = {};

        //validation in submit time
        if (!formData.firstname) newErrors.firstname = "Please enter firstname";
        if (!formData.lastname) newErrors.lastname = "Please enter lastname";
        if (!formData.email) newErrors.email = "Please enter your email";
        else if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|in|co|net|org)$/.test(formData.email)) {
            newErrors.email = "Please enter a valid Gmail address";
        }
        if (!isEditMode) {
            if (!formData.password) newErrors.password = "please enter the password"
            else if (!passwordRegex.test(formData.password)) {
                newErrors.password = "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character"
            }
        }
        //filtering
        const addressArray = formData.address
            .map(addr => ({ line: addr.line.trim() }))
            .filter(addr => addr.line !== '');
        if (addressArray.length === 0) newErrors.address = "Please enter at least one address";

        if (!formData.mobile) newErrors.mobile = "Please enter mobile number";
        else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number 10 digits";
        }

        if (!formData.description) newErrors.description = "Please enter description";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setStatus(true);

        const updatedFormData = {
            ...formData,
            address: addressArray
        };

        try {
            const token = localStorage.getItem('token');
            const res = formData._id ?
                await axios.put(`${BASE_URL}/user/update/${formData._id}`, updatedFormData, { headers: { Authorization: `Bearer ${token}` } })
                : await axios.post(`${BASE_URL}/user/register/`, updatedFormData, { headers: { Authorization: `Bearer ${token}` } })

            //updating avatar
            if (file) {
                const avatarForm = new FormData();
                avatarForm.append("avatar", file)

                const userId = formData._id || res.data.data._id
                await axios.put(`${BASE_URL}/user/${userId}/avatar`, avatarForm, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                })
            }
            toast.success(res.data.message);
            navigate("/userlist");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setStatus(false);
            console.log(formData._id);
        }
    };

    const handleAddAddress = () => {
        setFormData({
            ...formData,
            address: [...formData.address, { line: "" }]
        });
    };
    const handleAddress = (index, value) => {
        const updateAddress = [...formData.address]
        updateAddress[index] = { ...updateAddress[index], line: value }
        setFormData({
            ...formData,
            address: updateAddress
        });
        validate("address", updateAddress)
    }
    const handleRemoveAddress = (index) => {
        const updatedAddress = formData.address.filter((_, i) => i !== index);
        setFormData({
            ...formData, address: updatedAddress
        })
        validate("address", updatedAddress);
    };

    const validate = (name, value) => {
        let error = "";
        //validation in typing time
        switch (name) {
            case "firstname":
                if (!value) error = "Please enter your firstname";
                break;
            case "lastname":
                if (!value) error = "Please enter your lastname";
                break;
            case "password":
                if (!value) error = "Please enter your password";
                else if (value.length < 8) error = "Password must be at least 8 characters";
                else if (!passwordRegex.test(value)) {
                    error = "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character"
                }
                break;
            case "email":
                if (!value) error = "Please enter your email";
                else if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|in|co|net|org)$/
                    .test(value)) {
                    error = "Please enter a valid Gmail address";
                }
                break;
            case "address":
                const isAnyAddressFilled = value.some(addr => addr.line.trim() !== "");
                if (!isAnyAddressFilled) error = "Please enter at least one address";
                break;
            case "description":
                if (!value) error = "Please enter a description";
                break;
            case "mobile":
                if (!value) error = "Please enter your mobile number";
                else if (!/^\d{10}$/.test(value)) {
                    error = "Mobile number must be 10 digits";
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };
    const handleFile = (e) => {
        const selected = e.target.files[0]
        setFile(selected)
        if (selected) {
            setPreview(URL.createObjectURL(selected))
        }
    }

    return (
        <div className="position-relative">

            {status && (
                <div className="load position-absolute w-100 h-100vh top-0 justify-content-center align-items-center ">
                    <Loading />
                </div>
            )}
            <div className="container mt-4 w-75">
                <h2 className="mb-4">{formData._id ? "Edit User" : "Register User"}</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            isInvalid={!!errors.firstname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.firstname}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            isInvalid={!!errors.lastname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.lastname}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className={`mb-3 ${formData._id ? "d-none" : ""}`} >
                        <Form.Label>Password</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                                className=""
                            />
                            <span onClick={handleToggle} className="eyeSymbol">
                                {!showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>

                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>

                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        {formData.address.map((addr, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Form.Control
                                    type="text"
                                    value={addr.line}
                                    onChange={(e) => handleAddress(index, e.target.value)}
                                    placeholder={`Address ${index + 1}`}
                                    isInvalid={!!errors.address && index === 0}
                                />
                                {formData.address.length > 1 && (
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className="ms-2"
                                        onClick={() => handleRemoveAddress(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                        {errors.address && (
                            <div className="text-danger mb-2">{errors.address}</div>
                        )}
                        <Button variant="primary" type="button" onClick={handleAddAddress}>
                            + Add
                        </Button>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    handleChange(e);
                                }
                            }}
                            maxLength={10}
                            isInvalid={!!errors.mobile}

                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label id="avatarHeading">{formData._id ? "Edit Avatar" : "Upload Avatar"}</Form.Label>
                        <Form.Control type="file" id="avatarId" accept="image/*" onChange={handleFile} className="d-none" />

                        {preview && (
                            <div className="mt-2">
                                <label htmlFor="avatarId" style={{ cursor: "pointer" }}>
                                    <img
                                        src={preview}
                                        alt="avatar"
                                        className="avatarImg"
                                    />
                                </label>
                            </div>
                        )}
                    </Form.Group>



                    <Button variant={status ? "secondary" : "primary"} type="submit" disabled={status}>
                        {status ? "Submitting..." : formData._id ? "Update" : "Register"}
                    </Button>
                </Form>
            </div>
        </div >
    );
};

export default AddEdit;
