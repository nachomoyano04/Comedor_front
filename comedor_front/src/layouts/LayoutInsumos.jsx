import { Outlet } from "react-router-dom";
import {useState, useEffect} from "react";
import { getUdm } from "../services/api";

const LayoutInsumos = () => {
    const [unidades_de_medida, setUnidades_de_medida] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInsumos = async () => {
            try {
                const answer = await getUdm();
                setUnidades_de_medida(answer);
            } catch (err) {
                console.log(err);
                setError("Error al obtener unidades de medida");
            } finally {
                setLoading(false);
            }
        }
        loadInsumos();
    }, []);

    return(
        <div className="bg-light rounded shadow-sm p-4">
            {/* Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Gestión de Insumos</h2>
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
                    <Outlet context={{unidades_de_medida}}/>
                </div>
            )}
        </div>) 
}

export default LayoutInsumos;