import Sidebar from '../components/sidebar'
import { Outlet } from 'react-router-dom'
import Nav from '../components/nav'
import {useState} from 'react'


const Layout2 = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen((prev) => !prev)
    }

    return (
        <div>
            <Sidebar isOpen = {isOpen} setIsOpen = {setIsOpen}/>
            <div className="main-content p-3">
                <Nav handleToggle={handleToggle}/>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout2;