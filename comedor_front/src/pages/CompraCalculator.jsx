import { useEffect, useState } from "react";
import FormCalculadora from "../components/FormCalculadora";
import { getRecetas } from "../services/api";

const CompraCalculator = () => {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecetas = async () => {
            try {
                const resultado = await getRecetas();
                let recipes = resultado.reduce((acc, el) => {
                    if(!acc[el.id]){
                        acc[el.id] = {value: el.id, label:el.nombre, cuantos_comen: el.cuantos_comen, estado: el.estado, insumos: []}
                    }
                    acc[el.id].insumos.push({label: el.producto, cantidad: el.cantidad, simbolo: el.simbolo, value: el.insumo_id}); 
                    return acc;
                }, {});
                recipes = Object.values(recipes).filter(r => r.estado == 1).map(r => ({...r, insumos: r.insumos.sort((a,b) => a.value - b.value)}));
                setRecetas(recipes);
            } catch (err) {
                console.log(err);
                setError("Error al cargar recetas");                
            }finally{
                setLoading(false);
            }
        }
        loadRecetas();
    }, [])

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Calculadora de compras</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<FormCalculadora recetas={recetas} />)
            }
        </div>
    </>
}

export default CompraCalculator;