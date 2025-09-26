import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoles, getUsuarioByDni } from "../services/api";
import FormUsuario from "../components/FormUsuario";

const UpdateUser = () => {
    const [usuario, setUsuario] = useState(null); 
    const [roles, setRoles] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {dni} = useParams();
    useEffect(() => {
        const loadUser = async () => {
            try {
                const respuestaUsuario = await getUsuarioByDni(dni);
                setUsuario(respuestaUsuario);
                const respuestaRoles = await getRoles();
                setRoles(respuestaRoles);
            } catch (err) {
                console.log(err);
                setError("Error al obtener el usuario");
            } finally{
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleSubmitForm = formData => {
        
    }

    return <>
        <h1 className="card-title mt-3">Datos del usuario</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading? 
            (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>):
            (<div className="container  border border-danger my-3 py-3">
                <FormUsuario usuario={usuario} roles={roles} onSubmit={handleSubmitForm}/>
            </div>)};
    </>
}

export default UpdateUser;