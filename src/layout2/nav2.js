
import { List } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import { CiSettings } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";    

const Nav2 = ({ handleToggle }) => {
    const count = 3

    return (
        <div className="d-flex flex-column ">
            <div className="nav d-flex flex-column flex-md-row justify-content-between align-items-md-center py-2 mt-4 px-3 rounded   w-100">
                <div className="">
                    <h5 className="heading1" >Real Estate Telemarketing Analytics</h5>
                    <p className="subHeading mb-0" ><CiCalendarDate />Thursday, June 26, 2025</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="d-md-none p-2 bg-grey text-white">
                        <Button variant="light" onClick={() => handleToggle()} >
                            <List size={24} />
                        </Button>
                    </div>
                    <div className="position-relative">
                        <IoIosNotificationsOutline className="emoji" />
                        {count > 0 && (
                            <span className="notif-badge">{count}</span>
                        )}
                    </div>
                    
                    <CiSettings className="emoji"/>
                    <div className="ad">AD</div>
                    <div className="ad1">
                        <strong className="heading">Admin</strong>
                        <p className="subHeading mb-0 ">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav2;
