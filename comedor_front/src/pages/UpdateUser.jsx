import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getUsuarioByDni, updateUsuario } from "../services/api_endpoints";
import FormUsuario from "../components/FormUsuario";
import Swal from "sweetalert2";

const UpdateUser = () => {
    const navigate = useNavigate();
    const {roles} = useOutletContext();
    const [usuario, setUsuario] = useState(null); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const {dni} = useParams();
    useEffect(() => {
        const loadUser = async () => {
            try {
                const resUser = await getUsuarioByDni(dni);
                let user = resUser.reduce((acc, u) => {
                    if(acc.length == 0){
                        acc = {id:u.id, nombre:u.nombre, apellido:u.apellido, dni:u.dni, cuil:u.cuil, correo: u.correo, telefono:u.telefono, estado:u.estado, rol: []}
                    }
                    acc.rol.push(u.rol_id);
                    return acc;
                }, []);
                user = {...user, rol: user.rol?.sort((a,b) => a-b)}
                setUsuario(user);
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
            if(formData.rol.length == 0){
                throw Error("Debe asignar un rol")
            }
            const answer = await updateUsuario(formData, usuario.id);
            await Swal.fire({ title: answer, icon: "success", timer: 2000});
            navigate("/usuario/listado");
        } catch (err) {
            Swal.fire({title: err.response? err.response.data.error : err, icon: "error"})
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
                            <FormUsuario usuario={usuario} roles={roles} onSubmit={handleSubmitForm}/>
                        </div>
                    </div>
                )}
            </div>
        </>
}

export default UpdateUser;