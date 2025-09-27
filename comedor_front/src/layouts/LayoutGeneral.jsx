import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
const LayoutGeneral = () => {
    return <div className="bg-secondary">
                <NavBar />
                <div className="container">
                    <Outlet />
                </div>
            </div>
}

export default LayoutGeneral;