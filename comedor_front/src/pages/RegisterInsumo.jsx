import FormInsumo from "../components/FormInsumo";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createInsumo } from "../services/api";
import Swal from "sweetalert2"

const RegisterInsumo = () => {
    const {unidades_de_medida} = useOutletContext();
    const navigate = useNavigate();

    const handleSubmitForm = async formData => {
        try {
            const resultado = await createInsumo(formData);
            await Swal.fire({
                title: resultado,
                icon: "success",
                timer: 4000
            });
            navigate("/insumos/listado");
        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: err.response.data
            })
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Registrar Insumo</h5>
        </div>
        <div className="card-body d-flex justify-content-center">
            <div style={{width: "100%", maxWidth: "800px"}}>
                <FormInsumo unidades_de_medida={unidades_de_medida} onSubmit={handleSubmitForm} />
            </div>
        </div>
    </>
}

export default RegisterInsumo;