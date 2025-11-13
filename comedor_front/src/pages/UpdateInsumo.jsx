import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getInsumo, updateInsumo } from "../services/api";
import FormInsumo from "../components/FormInsumo";
import Swal from "sweetalert2";

const UpdateInsumo = () => {
    const navigate = useNavigate();
    const {unidades_de_medida} = useOutletContext();
    const {id} = useParams();
    const [insumo, setInsumo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
        
    useEffect(() => {
        const loadInsumo = async () => {
            try {
                const answer = await getInsumo(id);
                setInsumo(answer);
            } catch (err) {
                console.log(err);
                setError("Error al obtener insumo");
            } finally{
                setLoading(false);
            }
        };
        loadInsumo();
    }, []);

    const handleSubmitForm = async formData => {
        try {
            const resultado = await updateInsumo(id, formData);
            await Swal.fire({
                title: resultado,
                icon: "success",
                timer: 4000
            })
            navigate("/insumos/listado");
        } catch (e) {
            Swal.fire({
                    icon: "error",
                    title: e.response.data.error
            })
        }
    }

    return <>
        {/* Card Header */}
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Editar Insumo</h5>
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
                            <FormInsumo insumo={insumo} unidades_de_medida={unidades_de_medida} onSubmit={handleSubmitForm}/>
                        </div>
                    </div>
                )}
            </div>
    </>
}

export default UpdateInsumo;