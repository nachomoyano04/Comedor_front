import Swal from "sweetalert2";
import { createProveedor } from "../services/api";
import { useNavigate } from "react-router-dom";
import FormProveedor from "../components/FormProveedor";

const RegisterProve = () => {
    const navigate = useNavigate();

    const handleSubmitForm = async formData => {
        const res = await Swal.fire({
            title: "Esta seguro que desea registrar el proveedor?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        });
        if(res.isConfirmed){
            try {
                const respuesta = await createProveedor(formData);
                await Swal.fire({
                    title: "Proveedor registrado",
                    icon: "success",
                    text: respuesta.data
                })
                navigate("/proveedores/listado");
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data
                })
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Registrar Proveedor</h5>
        </div>
        <div className="card-body d-flex justify-content-center">
            <div style={{width: "100%", maxWidth: "800px"}}>
                <FormProveedor onSubmit={handleSubmitForm}/>
            </div>
        </div>
    </>
}

export default RegisterProve;