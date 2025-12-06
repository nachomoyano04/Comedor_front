import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"
import { useState } from "react";
const LayoutGeneral = () => {

    const [sideBarOpen, setSideBarOpen] = useState(true);

    return (<> 
        <div className="d-flex">
            <Sidebar onToggle={setSideBarOpen}/>
            <div className="flex-grow-1 p-4" style={{marginLeft: sideBarOpen? "260px": "70px", transition: "0.3s"}}>
                <Outlet />
            </div>
        </div>
    </>);
}

export default LayoutGeneral;