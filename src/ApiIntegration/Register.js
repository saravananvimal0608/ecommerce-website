
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// import Loading from '../components/Loading'
import Common from '../components/Common'

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        password: "",
        email: "",
        address: [{ line: "" }],
        description: "",
        mobile: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [status, setStatus] = useState(false)
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const handleToggle = () => {
        setShowPassword(!showPassword)
    }
    //address box

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.firstname) newErrors.firstname = "Please enter your firstname";
        if (!formData.lastname) newErrors.lastname = "Please enter your lastname";
        if (!formData.password) newErrors.password = "Please enter your password";
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        } if (!formData.email) newErrors.email = "Please enter your email";
        else if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|in|co|net|org)$/
            .test(formData.email)) {
            newErrors.email = "Please enter a valid Gmail address";
        }
        const isAnyAddressFilled = formData.address.some(addr => addr.line.trim() !== "");
        if (!isAnyAddressFilled) newErrors.address = "Please enter at least one address";
        if (!formData.description) newErrors.description = "Please enter a description";
        if (!formData.mobile) newErrors.mobile = "Please enter your mobile number";
        else if (formData.mobile.length !== 10) newErrors.mobile = "Mobile number must be 10 digits";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        setStatus(true)


        const filteredAddress = formData.address.filter(addr => addr.line.trim() !== "");
        const finalData = { ...formData, address: filteredAddress }
        try {
            const res = await axios.post(`${BASE_URL}/user/register`, finalData);
            setStatus(false)
            if (res && res.data) {
                toast.success(res.data.message);
                navigate("/userlist");
            }
        } catch (error) {
            setStatus(false)
            toast.error(error.response.data.message);
        } finally {
            setTimeout(() => {
                setStatus(false);
            }, 20000);
        }
    };
    // if (status) {
    //     return <Loading />
    // }

    return (
        <>
            <Common formData={formData}
                setFormData={setFormData}
                errors={errors}
                status={status}
                setStatus={setStatus}
                handleToggle={handleToggle}
                handleAddAddress={handleAddAddress}
                handleAddress={handleAddress}
                handleRemoveAddress={handleRemoveAddress}
                handleSubmit={handleSubmit}
                validate={validate}
                showPassword={showPassword} />
        </>
    );
};

export default Register;
