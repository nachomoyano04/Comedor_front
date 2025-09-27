import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { getInsumo } from "../services/api";
import FormInsumo from "../components/FormInsumo";

const UpdateInsumo = () => {
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

    const handleSubmitForm = (formData) => {
        console.log(formData);
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