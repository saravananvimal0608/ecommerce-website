import Sidebar2 from '../layout2/sidebar2'
import { Outlet } from 'react-router-dom'
import Nav2 from '../layout2/nav2'
import {useState} from 'react'


const Layout2 = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev)
    }

    return (
        <div>
            <Sidebar2 isOpen = {isOpen} setIsOpen = {setIsOpen}/>
            <div className="main-content p-3">
                <Nav2 handleToggle={handleToggle}/>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout2;