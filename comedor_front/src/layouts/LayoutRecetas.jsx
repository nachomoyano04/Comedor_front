import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getInsumos } from "../services/api";

const LayoutRecetas = () => {
    const [insumos, setInsumos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const respuesta = await getInsumos();
                const ins = respuesta.filter(i => i.estado == 1).map(i => {return {value: i.id, label: i.producto, simbolo: i.simbolo}});
                setInsumos(ins);
            } catch (err) {
                console.log(err);
                setError("Error al cargar los insumos");
            } finally {
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);


    return (
        <div className="bg-light rounded shadow-sm p-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Recetas</h2>
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
                    <Outlet context={{insumos}}/>
                </div>
            )}
        </div>) 
}

export default LayoutRecetas;