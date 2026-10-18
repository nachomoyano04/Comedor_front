import { useEffect, useState, useContext } from "react";
import ListaCompras from "../components/ListaCompras";
import { deleteCompra, getTodasLasCompras } from "../services/api_endpoints";
import notify from "../utils/notify";
import { Link, useOutletContext } from "react-router-dom";
import { AuthContext } from "../services/AuthProvider";
import { FaPlus } from "react-icons/fa";

const Compras = () => {
    const { user } = useContext(AuthContext);
    const { insumos = [] } = useOutletContext();
    const [compras, setCompras] = useState([]);
    const [ins, setIns] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const i = (insumos || []).map(insumo => ({ value: insumo.id, label: insumo.producto }));
        setIns(i);
    }, [insumos]);

    useEffect(() => {
        const loadCompras = async () => {
            try {
                const c = await getTodasLasCompras();
                setCompras(Array.isArray(c) ? c : []);
            } catch (err) {
                console.error(err);
                setError("Error al cargar las compras realizadas");
            } finally {
                setLoading(false);
            }
        };
        loadCompras();
    }, []);

    const handleDeleteCompra = async id => {
        const confirmado = await notify.confirm({
            title: "¿Eliminar compra?",
            text: "¿Estás seguro de que deseas eliminar este registro de compra?",
            confirmButtonText: "Sí, eliminar"
        });
        if (confirmado) {
            try {
                const resultado = await deleteCompra(id);
                notify.success(typeof resultado === "string" ? resultado : "Compra eliminada");
                setCompras(prev => prev.filter(c => c.id != id));
            } catch (err) {
                notify.error(err.response?.data?.error || "Error al eliminar la compra");
            }   
        }
    };

    return (
        <>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Historial de Compras</h5>
                {user?.roles?.some(r => [1, 2, 3].includes(r)) && (
                    <Link to="/insumos/nueva_compra" className="btn btn-sm btn-light fw-semibold d-flex align-items-center gap-1">
                        <FaPlus size={11} />
                        <span>Nueva Compra</span>
                    </Link>
                )}
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando compras...</span>
                        </div>
                    </div>
                ) : (
                    <ListaCompras 
                        insumos={ins} 
                        compras={compras} 
                        onClickDeleteCompra={handleDeleteCompra}
                    />
                )}
            </div>
        </>
    );
};

export default Compras;