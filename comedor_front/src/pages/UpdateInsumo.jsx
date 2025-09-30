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
                    title: "Error",
                    text: e.response.data
            })
        }
    }

    return <div className="border">
                <h4 className="card-title mt-3">Datos del insumo</h4>
                {error && <span className="bs-danger">{error}</span>}
                {loading? 
                    (<div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>):
                    (<div className="container my-3 py-3">
                        <FormInsumo insumo={insumo} unidades_de_medida={unidades_de_medida} onSubmit={handleSubmitForm}/>
                    </div>)}
            </div>

}

export default UpdateInsumo;