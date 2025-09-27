import FormInsumo from "../components/FormInsumo";
import { useOutletContext } from "react-router-dom";

const RegisterInsumo = () => {
    const {unidades_de_medida} = useOutletContext();
    const handleSubmitForm = formData => {
        console.log(formData);
    }

    return <>
        <h4 className="card-title mt-3">Registro de insumo</h4>
        <FormInsumo unidades_de_medida={unidades_de_medida} onSubmit={handleSubmitForm} />
    </>
}

export default RegisterInsumo;