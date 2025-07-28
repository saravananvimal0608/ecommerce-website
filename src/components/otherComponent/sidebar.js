import { NavLink } from 'react-router-dom';
import { IoIosCall } from "react-icons/io";
import { HiOutlineUsers } from "react-icons/hi";
import { GrAnalytics } from "react-icons/gr";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { GrBriefcase } from "react-icons/gr";
import { AiOutlineHome } from "react-icons/ai";
import { PiFigmaLogoFill } from "react-icons/pi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate()
    //logout Button
    const handleLogOut = () => {
        localStorage.removeItem("token")
        toast.success("successfully logout")
        navigate("/login");
    }

    return (
        <div
            className={`sidebar vh-100 fixed-top sidebar bg-dark p-3 overflow-auto d-flex flex-column  ${isOpen ? 'active' : ''}`}
        >

            <div className="d-flex justify-content-between">

                <h5 className="mb-4 text-white"> <PiFigmaLogoFill />Advinci</h5>
                <button onClick={() => setIsOpen(false)} style={{ height: "36px", width: "30px", display: "none" }} className="button">x</button>
            </div>
            <div className="d-flex flex-column justify-content-between h-100">

                <div className="d-flex flex-column gap-3 mb-5">
                    <hr style={{ color: 'grey' }} />
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `d-flex align-items-center position-relative gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }
                    >
                        <div className="insideSB " style={{ backgroundColor: "#a5a5a5", color: "#a5a5a5" }}>.</div>
                        <AiOutlineHome />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/userlist"
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }
                    >
                        <GrBriefcase />
                        User List
                    </NavLink>

                    <NavLink
                        to="/addcategory"
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }
                    >
                        <IoIosCall />
                        Add Category
                    </NavLink>

                    <NavLink
                        to="/viewcategorylist"
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }
                    >
                        <HiOutlineUsers />
                        View Category List
                    </NavLink>

                    <NavLink
                        to="/addproduct"
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }

                    >
                        <GrAnalytics />
                        Add Product
                    </NavLink>

                    <NavLink
                        to="/viewproduct"
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }
                    >
                        <IoChatbubbleOutline />
                        view Product
                    </NavLink>

                    <NavLink
                        to="/whatsapp"
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 w-100 py-2 ps-3 rounded text-white text-decoration-none ${isActive ? 'bg-active' : ''}`
                        }
                    >
                        <FaRegMessage />
                        Whatsapp
                    </NavLink>

                </div>
                <div className="d-flex justify-content-end flex-column" >
                    <hr style={{ color: 'grey' }} />
                    <p className="text-white text-center ">v1.0.0</p>
                    <p
                        className="para text-white text-center "
                        onClick={() => handleLogOut()}
                    >
                        Logout
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
