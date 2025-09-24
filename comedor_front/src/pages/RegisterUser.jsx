import { useEffect, useState } from "react";
import { createUsuario, getRoles } from "../services/api";
import FormUsuario from "../components/FormUsuario"
import Swal from "sweetalert2"
// import UsuarioForm from "../components/UsuarioForm"
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

    const handleSubmitForm = formData => {
        Swal.fire({
            title:"Esta seguro que quiere registrar el usuario?",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonText: "Si",
            cancelButtonText: "Cancelar",
        }).then(async res => {
            if(res.isConfirmed){
                const respuesta = await createUsuario(formData);
                Swal.fire({
                    title:"Usuario registrado",
                    icon: "success",
                    text: respuesta
                })
            }
        });
    }

    return <>
        <h1 className="card-title mt-3">Registro de usuario</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading? 
            (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>):
            (<div className="container  border border-danger my-3 py-3">
                <FormUsuario roles={roles} onSubmit={handleSubmitForm}/>
            </div>)};
    </>
}

export default RegisterUser;