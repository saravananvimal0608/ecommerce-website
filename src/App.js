import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Userlist from './ApiIntegration/UserList';
import Layout from './components/otherComponent/layout';
import Project from './components/otherComponent/project'
import Call from './components/otherComponent/category'
import Login from './ApiIntegration/Login'
import PrivateRouter from './PrivateRouter';
import { ToastContainer } from 'react-toastify';
import NoData from './layout2/NoData'
import Dashboard from './components/otherComponent/dashboard';
import AddEdit from './components/AddEdit'
import AddCategory from './components/addAndEditCategory'
import ViewCategory from './components/viewCategory'
import AddProduct from './components/addEditProduct'
import ViewProduct from './components/viewProduct' 

const App = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<Login />} />


        <Route path="/" element={<PrivateRouter>  <Layout />  </PrivateRouter>}>
          <Route index element={<Dashboard />} />
          <Route path='/userlist' element={<Userlist />} />
          {/* <Route path='/addedit' element={<AddEdit />} /> */}
          <Route path="/register" element={<AddEdit />} />
          <Route path='/edit/:id' element={<AddEdit />} />
          <Route path='/test/:id' element={<Project />} />
          <Route path='/category/:category' element={<Call />} />
          <Route path="/addcategory" element={<AddCategory />} />
          <Route path="/updatecategory/:id" element={<AddCategory />} />
          <Route path='/viewcategorylist' element={<ViewCategory />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/updateProduct/:id" element={<AddProduct />} />
          <Route path="/viewproduct" element={<ViewProduct/>}/>
          <Route path="/error" element={<NoData />} />
          <Route path="*" element={<h1>404</h1>} />
        </Route>

      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
};

export default App;
