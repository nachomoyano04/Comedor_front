import Swal from "sweetalert2";
import FormPassword from "../components/FormPassword";
import { useContext } from "react";
import { AuthContext } from "../services/AuthProvider";
import { changePasswordUser } from "../services/api_endpoints";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleSubmit = async formData => {
        const res = await Swal.fire({
            title: "Seguro desea cambiar la contraseña?", icon: "warning", confirmButtonText: "Si", showCancelButton: true
        });
        if (res.isConfirmed) {
            try {
                const { actual, nueva } = formData;
                const respuesta = await changePasswordUser(actual, nueva, user.id);
                await Swal.fire({ title: respuesta, icon: "success", timer: 2000 });
                navigate("/usuario/listado")
            } catch (error) {
                Swal.fire({ title: error.response.data, icon: "error" })
            }
        }
    }

    return <>
        {/* Card Header */}
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Cambiar contraseña</h5>
        </div>
        {/* Card Body */}
        <div className="card-body">
            <div className="card-body d-flex justify-content-center">
                <div style={{ width: "100%", maxWidth: "800px" }}>
                    <FormPassword onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    </>
}

export default ChangePass;