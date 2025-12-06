import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getRoles } from "../services/api_endpoints";

const LayoutUsers = () => {
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await getRoles();
                setRoles(response);
            } catch (err) {
                console.log(err);
                setError("Error al obtener roles");
            } finally{
                setLoading(false);
            }
        }
        loadRoles();
    }, [])
    
    return (
        <div className="bg-light rounded shadow-sm p-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Usuarios</h2>
            </div>
            {/* Mensajes */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Loader o contenido */}
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm border-0">
                    <Outlet context={{ roles }} />
                </div>
            )}
        </div>
    );
};
export default LayoutUsers;