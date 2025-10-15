import { useOutletContext, useParams } from "react-router-dom";
import FormReceta from "../components/FormReceta";
import { useEffect, useState } from "react";
import { getRecetaById } from "../services/api";

const UpdateReceta = () => {
    const {id} = useParams();
    const {insumos} = useOutletContext(); 
    const [ins, setIns] = useState(insumos);
    const [receta, setReceta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReceta = async () => {
            try {
                const resultado = await getRecetaById(id);
                let recipe = resultado.reduce((acc, el) => {
                    if(!acc){
                        acc = {id: el.id, nombre: el.nombre, descripcion: el.descripcion, estado: el.estado, insumo: []};
                    }
                    acc.insumo.push({value: el.insumo_id, simbolo: el.simbolo, label: el.producto, cantidad: el.cantidad});
                    return acc;
                }, null);
                let idsInsumos = resultado.reduce((acc, el) => {
                    if(!acc.includes(el.insumo_id)){
                        acc.push(el.insumo_id);
                    }
                    return acc;
                }, [])
                setIns(insumos.filter(i => !idsInsumos.includes(i.value)));
                setReceta(recipe); 
            } catch (err) {
                console.log(err);
                setError("Error al obtener receta");
            } finally {
                setLoading(false);
            }
        }
        loadReceta();
    }, [id, insumos]);

    const handleSubmitReceta = formData => {
        console.log(formData);
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Editar receta</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<FormReceta ins={ins} re={receta} onSubmit={handleSubmitReceta}/>)
            }
        </div>
    </>

}

export default UpdateReceta;