import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaUtensils, FaShoppingCart } from "react-icons/fa";
import api from "../services/api";

const Dashboard = () => {
    const [insumosCriticos, setInsumosCriticos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Traemos todos los insumos para filtrar el stock bajo
                const { data } = await api.get("/insumos");
                
                // Filtramos insumos activos con stock menor o igual a 5 (ajustá este número según necesites)
                const criticos = data.filter(i => i.estado === 1 && parseFloat(i.stock) <= 5);
                setInsumosCriticos(criticos);
                
            } catch (error) {
                console.error("Error cargando datos del dashboard", error);
            } finally {
                setCargando(false);
            }
        };

        fetchDatos();
    }, []);

    if (cargando) return <div className="text-center mt-5">Cargando tablero...</div>;

    return (
        <div className="container-fluid mt-3">
            <h2 className="mb-4 text-secondary">Panel Principal</h2>

            {/* Fila de Tarjetas de Acceso Rápido */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card text-bg-primary h-100 shadow-sm">
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                            <FaUtensils size={40} className="mb-2" />
                            <h5 className="card-title">Registrar Producción</h5>
                            <Link to="/produccion/listado" className="btn btn-light mt-2 fw-semibold">
                                Ir a Producciones
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="card text-bg-success h-100 shadow-sm">
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                            <FaShoppingCart size={40} className="mb-2" />
                            <h5 className="card-title">Cargar Nueva Compra</h5>
                            <Link to="/insumos/nueva_compra" className="btn btn-light mt-2 fw-semibold">
                                Ir a Compras
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fila de Alertas y Gráficos */}
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-danger h-100">
                        <div className="card-header bg-danger text-white d-flex align-items-center gap-2">
                            <FaExclamationTriangle />
                            <h6 className="mb-0">Alertas de Stock Bajo</h6>
                        </div>
                        <div className="card-body p-0">
                            {insumosCriticos.length === 0 ? (
                                <div className="p-4 text-center text-success fw-semibold">
                                    Todo el stock está en niveles óptimos.
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {insumosCriticos.map(insumo => (
                                        <li key={insumo.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>
                                                <strong>{insumo.producto}</strong> <small className="text-muted">({(insumo.marca?insumo.marca:"sin marca")})</small>
                                            </span>
                                            <span className="badge bg-danger rounded-pill">
                                                {insumo.stock} 
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-light">
                            <h6 className="mb-0 text-secondary">Estadísticas (Próximamente)</h6>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center bg-light">
                            <p className="text-muted mb-0">
                                Acá podemos conectar ApexCharts para mostrar la evolución del Costo Primo Total.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;