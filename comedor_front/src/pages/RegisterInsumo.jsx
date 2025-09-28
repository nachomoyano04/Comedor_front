import FormInsumo from "../components/FormInsumo";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createInsumo } from "../services/api";
import Swal from "sweetalert2"

const RegisterInsumo = () => {
    const {unidades_de_medida} = useOutletContext();
    const navigate = useNavigate();

    const handleSubmitForm = async formData => {
        const resultado = await createInsumo(formData);
        await Swal.fire({
            title: resultado,
            icon: "success",
            timer: 4000
        });
        navigate("/insumos/listado");
    }

    return <>
        <h4 className="card-title my-3">Registro de insumo</h4>
        <FormInsumo unidades_de_medida={unidades_de_medida} onSubmit={handleSubmitForm} />
    </>
}

export default RegisterInsumo;