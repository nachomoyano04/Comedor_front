import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getRolesByUser, getUsuarioByDni, updateUsuario } from "../services/api";
import FormUsuario from "../components/FormUsuario";
import Swal from "sweetalert2";

const UpdateUser = () => {
    const navigate = useNavigate();
    const {roles} = useOutletContext();
    const [usuario, setUsuario] = useState(null); 
    const [rolesUser, setRolesUser] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {dni} = useParams();
    useEffect(() => {
        const loadUser = async () => {
            try {
                const respuestaUsuario = await getUsuarioByDni(dni);
                let respuestaRolesUser = await getRolesByUser(respuestaUsuario.id);
                respuestaRolesUser = respuestaRolesUser.map(e => e.id); // Armamos un arreglo con solo los id's de los roles
                setUsuario(respuestaUsuario);
                setRolesUser(respuestaRolesUser);
            } catch (err) {
                console.log(err);
                setError("Error al obtener el usuario");
            } finally{
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleSubmitForm = async formData => {
        try {
            const answer = await updateUsuario(formData, usuario.id);
            await Swal.fire({
                title: answer,
                icon: "success",
                timer: 2000,
            });
            navigate("/usuario/listado");
        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: err.response.data
            })
        }
    }

    return <>
            {/* Card Header */}
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Editar Usuario</h5>
            </div>
            {/* Card Body */}
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
                ) : (
                    <div className="card-body d-flex justify-content-center">
                        <div style={{width: "100%", maxWidth: "800px"}}>
                            <FormUsuario usuario={usuario} rolesUser={rolesUser} roles={roles} onSubmit={handleSubmitForm}/>
                        </div>
                    </div>
                )}
            </div>
        </>
}

export default UpdateUser;