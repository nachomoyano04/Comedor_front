import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProveedor, updateProveedor } from "../services/api";
import FormProveedor from "../components/FormProveedor"
import Swal from "sweetalert2";

const UpdateProve = () => {
    const {id} = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProv = async () => {
            try {
                const resultado = await getProveedor(id);
                setProveedor(resultado);
            } catch (err) {
                console.log(err);
                setError("Error al obtener el proveedor");
            } finally{
                setLoading(false);
            }
        }
        loadProv();
    }, [])

    const handleSubmitForm = async formData => {
        try {
            const response = await updateProveedor(id, formData);
            await Swal.fire({
                icon:"success",
                title: "Proveedor editado",
                text: response
            })
            navigate("/proveedores/listado");
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response.data
            })
        }
    }

    return <>
        {/* Card Header */}
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Editar Proveedor</h5>
        </div>
        {/* Card Body */}
        <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
            ) : (
                <div className="card-body d-flex justify-content-center">
                    <div style={{width: "100%", maxWidth: "800px"}}>
                        <FormProveedor proveedor={proveedor} onSubmit={handleSubmitForm} />
                    </div>
                </div>
            )}
        </div>
    </>
}

export default UpdateProve;