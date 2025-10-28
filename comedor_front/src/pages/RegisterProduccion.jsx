import FormProduccion from "../components/FormProduccion";
import { newProduccion } from "../services/api";
import Swal from "sweetalert2";
import { useNavigate, useOutletContext } from "react-router-dom";

const RegisterProduccion = () => {
    const navigate = useNavigate();
    const {recetas} = useOutletContext();

    const handleSubmitProduccion = async formData => {
        const res = await Swal.fire({
            title: "Seguro desea registrar la produccion?",
            icon: "warning", 
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        });
        if(res.isConfirmed){
            try {
                const r = await newProduccion(formData);
                Swal.fire({title: r, icon: "success", timer: 2000});
                navigate("/produccion/listado");
            } catch (err) {
                const {error} = err.response.data;
                Swal.fire({title: error, icon: "error"});
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Registrar Producción</h5>
        </div>
        <div className="card-body">
            <FormProduccion recetas={recetas} onSubmit={handleSubmitProduccion}/>
        </div>
    </>
}

export default RegisterProduccion;