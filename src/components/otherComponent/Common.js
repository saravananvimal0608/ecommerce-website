// import React from 'react';


// const Common = ({
//   formData,
//   setFormData,
//   status,
//   validate,
//   handleSubmit,
//   errors,
//   showPassword,
//   handleToggle,
//   handleAddAddress,
//   handleRemoveAddress,
//   handleAddress
// }) => {

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     validate(name, value);
//   };

//   return (
//     <div className="position-relative">

//       {status && (
//         <div className="load position-absolute w-100 h-100vh top-0 justify-content-center align-items-center ">
//           <Loading />
//         </div>
//       )}
//       <div className="container mt-4 w-75">
//         <h2 className="mb-4">{formData._id ? "Edit User" : "Register User"}</h2>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>First Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="firstname"
//               value={formData.firstname}
//               onChange={handleChange}
//               isInvalid={!!errors.firstname}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.firstname}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Last Name</Form.Label>
//             <Form.Control
//               type="text"
//               name="lastname"
//               value={formData.lastname}
//               onChange={handleChange}
//               isInvalid={!!errors.lastname}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.lastname}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className={`mb-3 ${formData._id ? "d-none" : ""}`} >
//             <Form.Label>Password</Form.Label>
//             <div className="position-relative">
//               <Form.Control
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 isInvalid={!!errors.password}
//                 className=""
//               />
//               <span onClick={handleToggle} className="eyeSymbol">
//                 {!showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>

//               <Form.Control.Feedback type="invalid">
//                 {errors.password}
//               </Form.Control.Feedback>
//               {errors.password && <p className="text-danger mt-1">{errors.password}</p>}
//             </div>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Email</Form.Label>
//             <Form.Control
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               isInvalid={!!errors.email}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.email}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Address</Form.Label>
//             {formData.address.map((addr, index) => (
//               <div key={index} className="d-flex mb-2">
//                 <Form.Control
//                   type="text"
//                   value={addr.line}
//                   onChange={(e) => handleAddress(index, e.target.value)}
//                   placeholder={`Address ${index + 1}`}
//                   isInvalid={!!errors.address && index === 0}
//                 />
//                 {formData.address.length > 1 && (
//                   <Button
//                     variant="primary"
//                     type="button"
//                     className="ms-2"
//                     onClick={() => handleRemoveAddress(index)}
//                   >
//                     Remove
//                   </Button>
//                 )}
//               </div>
//             ))}
//             {errors.address && (
//               <div className="text-danger mb-2">{errors.address}</div>
//             )}
//             <Button variant="primary" type="button" onClick={handleAddAddress}>
//               + Add
//             </Button>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Description</Form.Label>
//             <Form.Control
//               as="textarea"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               isInvalid={!!errors.description}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.description}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Mobile</Form.Label>
//             <Form.Control
//               type="text"
//               name="mobile"
//               value={formData.mobile}
//               onChange={handleChange}
//               isInvalid={!!errors.mobile}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.mobile}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Button variant={status ? "secondary" : "primary"} type="submit" disabled={status}>
//             {status ? "Submitting..." : formData._id ? "Update" : "Register"}
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Common;
