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
        const answer = await updateUsuario(formData, usuario.id);
        await Swal.fire({
            title: answer,
            icon: "success",
            timer: 2000,
        });
        navigate("/usuario/listado");
    }

    return <div className="border">
                <h4 className="card-title mt-3">Datos del usuario</h4>
                {error && <span className="bs-danger">{error}</span>}
                {loading? 
                    (<div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>):
                    (<div className="container my-3 py-3">
                        <FormUsuario usuario={usuario} rolesUser={rolesUser} roles={roles} onSubmit={handleSubmitForm}/>
                    </div>)};
            </div>
}

export default UpdateUser;