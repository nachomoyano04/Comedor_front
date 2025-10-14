import { Outlet } from "react-router-dom";

const LayoutRecetas = () => {
    return (
        <div className="bg-light rounded shadow-sm p-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Recetas</h2>
            </div>
            {/* Contenido */}
            <div className="card shadow-sm border-0">
                <Outlet />
            </div>
        </div>) 
}

export default LayoutRecetas;