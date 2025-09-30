import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"
const LayoutGeneral = () => {
    return (<> 
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4" style={{ marginLeft: "240px" }}>
                <Outlet />
            </div>
        </div>
    </>);
}

export default LayoutGeneral;