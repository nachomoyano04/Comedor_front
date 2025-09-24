import { useEffect, useState } from "react";
import { getRoles } from "../services/api";
import UsuarioForm from "../components/UsuarioForm"
const RegisterUser = () => {
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadRoles = async () => {
            try {
                const respuesta = await getRoles();
                setRoles(respuesta);  
            } catch (err) {
                console.log(error);
                setError("Error al traer los roles");
            } finally{
                setLoading(false);
            }
        }
        loadRoles();
    }, []);
    return <>
        <h1 className="card-title mt-3">Registro de usuario</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading? 
            (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>):
            (<div className="container  border border-danger my-3 py-3">
                <UsuarioForm roles={roles} />
            </div>)};
    </>
}

export default RegisterUser;