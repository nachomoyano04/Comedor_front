import { useEffect, useState } from "react";
import FormProduccion from "../components/FormProduccion";
import { getRecetas } from "../services/api";

const RegisterProduccion = () => {
    const [recetas, setRecetas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecetas = async () => {
            try {
                const resultado = await getRecetas();
                let recipes = resultado.reduce((acc, el) => {
                    if(!acc[el.id]){
                        acc[el.id] = {value: el.id, label:el.nombre, insumos: []}
                    }
                    acc[el.id].insumos.push({label: el.producto, cantidad: el.cantidad, simbolo: el.simbolo, value: el.insumo_id}); 
                    return acc;
                }, {});
                recipes = Object.values(recipes);
                setRecetas(recipes);
            } catch (err) {
                console.log(err);
                setError("Error al cargar recetas");
            } finally {
                setLoading(false);
            }
        }
        loadRecetas();
    }, []);

    const handleSubmitProduccion = formData => {
        console.log(formData);
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Registrar Producción</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
                {loading ? (<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>) :
                    (<FormProduccion recetas={recetas} onSubmit={handleSubmitProduccion}/>)
                }
            
        </div>
    </>
}

export default RegisterProduccion;