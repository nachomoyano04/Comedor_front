import { useEffect, useState } from "react";
import FormCalculadora from "../components/FormCalculadora";
import { getRecetas, getPrecios } from "../services/api_endpoints";
import { useOutletContext, Link } from "react-router-dom";
import { FaCalculator, FaShoppingCart, FaListAlt } from "react-icons/fa";

const CompraCalculator = () => {
    const { insumos = [] } = useOutletContext();
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDatos = async () => {
            try {
                const [resultadoRecetas, preciosData] = await Promise.all([
                    getRecetas(),
                    getPrecios().catch(() => [])
                ]);

                // Mapear los precios más recientes por insumo_id
                const pMap = {};
                (Array.isArray(preciosData) ? preciosData : []).forEach((p) => {
                    const insId = p.insumo_id || p.id;
                    if (insId) {
                        pMap[insId] = {
                            precio_unitario: parseFloat(p.precio_unitario) || 0,
                            proveedor: p.razon_social || "",
                            proveedor_id: p.proveedor_id || "",
                            unidad_de_medida: p.unidad_de_medida || ""
                        };
                    }
                });

                // Mapear stock desde los insumos del contexto
                const insumosMap = {};
                (insumos || []).forEach((i) => {
                    insumosMap[i.id] = {
                        stock: parseFloat(i.stock) || 0,
                        codigo: i.codigo || "",
                        simbolo: i.simbolo || ""
                    };
                });

                // Agrupar recetas con sus ingredientes enriquecidos
                let recipes = (resultadoRecetas || []).reduce((acc, el) => {
                    const id = el.id || el.receta_id || el.value;
                    if (!id) return acc;

                    if (!acc[id]) {
                        acc[id] = {
                            id: id,
                            value: id,
                            label: el.nombre || el.label || `Receta #${id}`,
                            nombre: el.nombre || el.label || `Receta #${id}`,
                            cuantos_comen: parseFloat(el.cuantos_comen) || 1,
                            estado: el.estado,
                            descripcion: el.descripcion || "",
                            insumos: []
                        };
                    }
                    if (el.insumo_id) {
                        const stockInfo = insumosMap[el.insumo_id];
                        const precioInfo = pMap[el.insumo_id];

                        acc[id].insumos.push({
                            insumo_id: el.insumo_id,
                            label: el.producto || el.insumo_nombre || "Insumo",
                            producto: el.producto || el.insumo_nombre || "Insumo",
                            cantidad_base: parseFloat(el.cantidad) || 0,
                            simbolo: el.simbolo || stockInfo?.simbolo || "",
                            stock_actual: stockInfo ? stockInfo.stock : 0,
                            precio_unitario: precioInfo ? precioInfo.precio_unitario : 0,
                            proveedor: precioInfo ? precioInfo.proveedor : "",
                            proveedor_id: precioInfo ? precioInfo.proveedor_id : ""
                        });
                    }
                    return acc;
                }, {});

                // Filtrar recetas activas (o sin estado explícito) y ordenar alfabéticamente
                recipes = Object.values(recipes)
                    .filter((r) => r.estado === undefined || r.estado === null || r.estado == 1)
                    .map((r) => ({
                        ...r,
                        insumos: r.insumos.sort((a, b) => (a.label || "").localeCompare(b.label || ""))
                    }))
                    .sort((a, b) => (a.nombre || a.label || "").localeCompare(b.nombre || b.label || ""));

                setRecetas(recipes);
            } catch (err) {
                console.error("Error al cargar recetas y datos:", err);
                setError("Error al cargar las recetas y la información de compras.");
            } finally {
                setLoading(false);
            }
        };

        loadDatos();
    }, [insumos]);

    return (
        <div className="compra-calculator">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap gap-2 py-3 px-3 px-md-4">
                <div className="d-flex align-items-center gap-2">
                    <FaCalculator size={18} />
                    <h5 className="mb-0 fw-semibold">Calculadora de Compras para Menús</h5>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Link to="/insumos/compras" className="btn btn-sm btn-outline-light fw-medium d-flex align-items-center gap-1">
                        <FaListAlt size={12} />
                        <span className="d-none d-sm-inline">Historial</span>
                    </Link>
                    <Link to="/insumos/nueva_compra" className="btn btn-sm btn-light fw-semibold d-flex align-items-center gap-1 text-primary">
                        <FaShoppingCart size={12} />
                        <span>Nueva Compra</span>
                    </Link>
                </div>
            </div>

            <div className="card-body p-3 p-md-4">
                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-5">
                        <div className="spinner-border text-primary mb-2" role="status">
                            <span className="visually-hidden">Cargando calculadora...</span>
                        </div>
                        <small className="text-muted">Cargando recetas, stock y precios vigentes...</small>
                    </div>
                ) : (
                    <FormCalculadora recetas={recetas} />
                )}
            </div>
        </div>
    );
};

export default CompraCalculator;