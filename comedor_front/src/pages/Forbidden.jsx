import { useNavigate } from "react-router-dom";

export const Forbidden = () => {
    const navigate = useNavigate();
    return <>
        <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
                <h1 className="fw-bold display-1 text-secondary">403</h1>
                <h4 className="fw-semibold mt-3">Acceso restringido</h4>
                <p className="text-muted mt-2">No tienes permisos para realiza esta acción</p>
                <button className="btn btn-outline-secondary mt-4" onClick={() => navigate("/produccion/listado")}>Volver al inicio</button>
            </div>
        </div>
    </>
};
