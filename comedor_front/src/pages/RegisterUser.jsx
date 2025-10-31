import { createUsuario, getRoles } from "../services/api";
import FormUsuario from "../components/FormUsuario"
import Swal from "sweetalert2"
import { useNavigate, useOutletContext } from "react-router-dom";
const RegisterUser = () => {
    const navigate = useNavigate();
    const {roles} = useOutletContext();

    const handleSubmitForm = async formData => {
        const res = await Swal.fire({
            title:"Esta seguro que quiere registrar el usuario?",
            icon: "warning",
            showCancelButton: true, 
            confirmButtonText: "Si",
            cancelButtonText: "Cancelar",
        });
        if(res.isConfirmed){
            try {
                if(formData.rol.length == 0){
                    console.log("raw");
                    throw Error("Debe asignar un rol");
                }
                const respuesta = await createUsuario(formData);
                await Swal.fire({title: respuesta, icon: "success"});
                navigate("/usuario/listado")
            } catch (err) {
                Swal.fire({icon: "error", title: err.response? err.response.data : err});
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Registrar Usuario</h5>
        </div>
        <div className="card-body d-flex justify-content-center">
            <div style={{width: "100%", maxWidth: "800px"}}>
                <FormUsuario roles={roles} onSubmit={handleSubmitForm}/>
            </div>
        </div>
    </>
}

export default RegisterUser;