import FormReceta from "../components/FormReceta";
import { newReceta } from "../services/api";
import Swal from "sweetalert2"
import { useNavigate, useOutletContext } from "react-router-dom";

const RegisterReceta = () => {
    const navigate = useNavigate();
    const {insumos} = useOutletContext();

    const handleSubmitReceta = async formData => {
        if(formData.insumo.length == 0){ // si no seleccionó ningun insumo para la receta...
            Swal.fire({icon:"error", title: "Debe seleccionar al menos un insumo"});
        }else{
            const res = await Swal.fire({
                icon: "warning",
                title: "Seguro desea registrar la receta?",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Sí"
            });
            if(res.isConfirmed){
                try {
                    const resultado = await newReceta(formData);
                    await Swal.fire({ icon: "success", title: resultado});
                    navigate("/recetas/listado")
                } catch (err) {
                    Swal.fire({icon:"error", title: err.response.data});
                }
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Nueva receta</h5>
        </div>
        <div className="card-body">
            <FormReceta ins={insumos} onSubmit={handleSubmitReceta}/>
        </div>
    </>
}

export default RegisterReceta;