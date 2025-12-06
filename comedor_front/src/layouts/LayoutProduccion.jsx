import { Outlet } from "react-router-dom";
import { getInsumosParaReceta, getRecetas } from "../services/api_endpoints";
import { useEffect, useState } from "react";

const LayoutProducciones = () => {
    const [recetas, setRecetas] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecetasEInsumos = async () => {
            try {
                const resultado = await getRecetas();
                const i = await getInsumosParaReceta();
                let recipes = resultado.reduce((acc, el) => {
                    if(!acc[el.id]){
                        acc[el.id] = {value: el.id, label:el.nombre, estado: el.estado, insumos: []}
                    }
                    acc[el.id].insumos.push({label: el.producto, cantidad: el.cantidad, simbolo: el.simbolo, value: el.insumo_id}); 
                    return acc;
                }, {});
                recipes = Object.values(recipes).filter(r => r.estado == 1).map(r => ({...r, insumos: r.insumos.sort((a,b) => a.value - b.value)}));
                setRecetas(recipes);
                setInsumos(i.map(ins => ({value: ins.id, label: ins.producto, simbolo: ins.simbolo})));
            } catch (err) {
                console.log(err);
                setError("Error al cargar recetas");
            } finally {
                setLoading(false);
            }
        }
        loadRecetasEInsumos();
    }, []);
    return (
            <div className="bg-light rounded shadow-sm p-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Producciones</h2>
            </div>
            {/* Mensajes */}
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Loader o contenido */}
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>) : 
                (
                <div className="card shadow-sm border-0">
                    <Outlet context={{recetas, insumos}}/>
                </div>
            )}
        </div>)
}

export default LayoutProducciones;