import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getRoles } from "../services/api";

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
    
    return <div>
        <h1>Gestión de usuarios</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading?
                (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>): 
            <Outlet context={{roles}}/>
        }
        
    </div>
}
export default LayoutUsers;