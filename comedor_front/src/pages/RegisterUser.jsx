import { createUsuario, getRoles } from "../services/api";
import FormUsuario from "../components/FormUsuario"
import Swal from "sweetalert2"
import { useNavigate, useOutletContext } from "react-router-dom";
const RegisterUser = () => {
    const navigate = useNavigate();
    const {roles} = useOutletContext();

    const handleSubmitForm = formData => {
        Swal.fire({
            title:"Esta seguro que quiere registrar el usuario?",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonText: "Si",
            cancelButtonText: "Cancelar",
        }).then(async res => {
            if(res.isConfirmed){
                try {
                    const respuesta = await createUsuario(formData);
                    await Swal.fire({
                        title:"Usuario registrado",
                        icon: "success",
                        text: respuesta
                    });
                    navigate("/usuario/listado")
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: err.response.data
                    });
                }
            }
        });
    }

    return <>
        <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Registrar Usuario</h5>
            </div>
            <div className="card-body">
                <FormUsuario roles={roles} onSubmit={handleSubmitForm}/>
            </div>
        </div>
    </>
}

export default RegisterUser;