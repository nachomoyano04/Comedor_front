import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProveedor } from "../services/api";

const UpdateProve = () => {
    const {id} = useParams();
    const [proveedor, setProveedor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        <FormUsuario usuario={usuario} rolesUser={rolesUser} roles={roles} onSubmit={handleSubmitForm}/>
                    </div>
                </div>
            )}
        </div>
    </>
}

export default UpdateProve;