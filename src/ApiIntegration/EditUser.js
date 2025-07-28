import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Common from '../components/Common'

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(true);
    const [showPassword, setShowPassword] = useState(false)
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [errors, setErrors] = useState({});
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const handleToggle = () => {
        setShowPassword(!showPassword)
    }
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        address: [{ line: "" }],
        description: '',
        mobile: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${BASE_URL}/user/getuserid/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setFormData({
                    ...res.data.data,
                    address: Array.isArray(res.data.data.address)
                        ? res.data.data.address
                        : [{ line: "" }]
                });


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

    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.firstname) newErrors.firstname = "Please enter firstname";
        if (!formData.lastname) newErrors.lastname = "Please enter lastname";
        if (!formData.email) newErrors.email = "Please enter your email";
        else if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|in|co|net|org)$/.test(formData.email)) {
            newErrors.email = "Please enter a valid Gmail address";
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
            const res = await axios.put(`${BASE_URL}/user/update/${id}`, updatedFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(res.data.message);
            navigate("/userlist");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setStatus(false);
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
                else if (value.length !== 10) error = "Mobile number must be 10 digits";
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };
    // if (status) return <Loader />;

    return (
        <Common
            formData={formData}
            setFormData={setFormData}
            status={status}
            setStatus={setStatus}
            validate={validate}
            handleSubmit={handleSubmit}
            errors={errors}
            showPassword={showPassword}
            handleToggle={handleToggle}
            handleAddAddress={handleAddAddress}
            handleRemoveAddress={handleRemoveAddress}
            handleAddress={handleAddress}
        />
    );
};

export default EditUser;
