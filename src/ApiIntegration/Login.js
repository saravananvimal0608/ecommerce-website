import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loading from '../components/otherComponent/Loading'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(false)

  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const newErrors = {}

    if (!email) {
      newErrors.email = 'Please fill the email'

    }
    if (!password) {
      newErrors.password = "please fill the password"

    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return;
    setStatus(true)

    try {
      const res = await axios.post(`${BASE_URL}/user/login`, {
        email,
        password,
      });
      setStatus(false)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      toast.success(res.data.message);
      navigate('/');
    } catch (err) {
      if (err.message === 403) {
        toast.error(err.response.data.message)
      }
      else {
        toast.error(err.response.data.message);
      }
    } finally {
      setStatus(false);
    }
  };
  return (
    <div className="position-relative">
      {status && (
        <div
          className="load position-absolute top-0  w-100 h-100vh d-flex justify-content-center align-items-center"
        >
          <Loading />
        </div>
      )}
      <Form className="w-50 mx-auto bg-dark text-white p-3 rounded position-relative mt-3" onSubmit={handleSubmit}>
        <h4>Login</h4>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "is-invalid" : ""}
          />
          {errors.email && <p className="text-danger mt-1">{errors.email}</p>}
        </Form.Group>

        <Form.Group className="mb-3 position-relative" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "is-invalid" : ""}
          />
          {errors.password && <p className="text-danger mt-1">{errors.password}</p>}
          <span className="eyeSymbol1" onClick={handleToggle}>
            {!showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </Form.Group>

        <Button variant={status ? "secondary" : "primary"} type="submit" className="me-4" disabled={status}>
          {status ? "submitting..." : "Submit"}
        </Button>

        <Link to="/register" className="text-white">
          New user?
        </Link>
      </Form>
    </div>
  );
};

export default Login;