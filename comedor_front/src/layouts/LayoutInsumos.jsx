import { Outlet } from "react-router-dom";

const LayoutInsumos = () => {
    return <div>
        <h1>Gestion de insumos</h1>
        <Outlet />
    </div>
}

export default LayoutInsumos;