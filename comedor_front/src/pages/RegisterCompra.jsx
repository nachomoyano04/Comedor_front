import { useEffect, useState } from "react";
import { getProveedores, newCompra } from "../services/api_endpoints";
import FormCompra from "../components/FormCompra";
import notify from "../utils/notify";
import { useNavigate, useLocation, useOutletContext, Link } from "react-router-dom";
import {
    FaShoppingCart,
    FaCheck,
    FaArrowLeft,
    FaUtensils,
    FaListAlt,
    FaCalculator
} from "react-icons/fa";

const RegisterCompra = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { insumos = [], unidades_de_medida = [] } = useOutletContext();
    const [ins, setIns] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Estado cuando se proviene de la Calculadora de Compras
    const prefillState = location.state || {};
    const itemsPendientes = prefillState.itemsPendientes || (prefillState.prefill ? [prefillState.prefill] : []);
    const recetaNombre = prefillState.recetaNombre || "";
    const comensales = prefillState.comensales || "";

    const [indiceItemActivo, setIndiceItemActivo] = useState(prefillState.indiceSeleccionado || 0);
    const [compradosIds, setCompradosIds] = useState([]);

    const itemActual = itemsPendientes[indiceItemActivo] || null;

    useEffect(() => {
        const loadInsumosYProveedores = async () => {
            try {
                const provs = await getProveedores();
                const proves = (provs || [])
                    .filter((p) => p.estado == 1)
                    .map((p) => ({
                        name: "proveedor_id",
                        value: p.id,
                        label: p.razon_social
                    }));
                const i = (insumos || [])
                    .filter((insumo) => insumo.estado == 1)
                    .map((insumo) => ({
                        name: "insumo_id",
                        value: insumo.id,
                        label: insumo.producto,
                        id_udm: insumo.id_unidad_de_medida,
                        simbolo: insumo.simbolo
                    }));
                setProveedores(proves);
                setIns(i);
            } catch (err) {
                console.error("Error al cargar insumos y proveedores:", err);
                setError("Error al cargar insumos y proveedores");
            } finally {
                setLoading(false);
            }
        };
        loadInsumosYProveedores();
    }, [insumos]);

    const handleSubmit = async (formData) => {
        const confirmado = await notify.confirm({
            title: "¿Registrar compra?",
            text: `Se registrará la compra de ${formData.cantidad} ${formData.insumo_nombre || "insumo"} y se actualizará el stock en despensa.`,
            confirmButtonText: "Sí, registrar"
        });
        if (!confirmado) return;

        setSubmitting(true);
        try {
            const { insumo_nombre, proveedor_razon_social, precio_total, ...compra } = formData;
            if (!compra.fecha_vencimiento) {
                delete compra.fecha_vencimiento;
            }
            const resultado = await newCompra(compra);
            notify.success(typeof resultado === "string" ? resultado : "¡Compra registrada con éxito!");

            // Si venimos de la calculadora de compras con una lista de insumos pendientes:
            if (itemsPendientes.length > 0 && itemActual) {
                const nuevosComprados = [...compradosIds, itemActual.insumo_id];
                setCompradosIds(nuevosComprados);

                // Buscar el siguiente insumo de la lista que aún no haya sido cargado
                const siguienteIndice = itemsPendientes.findIndex(
                    (it, idx) => idx > indiceItemActivo && !nuevosComprados.includes(it.insumo_id)
                );

                if (siguienteIndice !== -1) {
                    setIndiceItemActivo(siguienteIndice);
                    notify.info(`Cargando siguiente insumo: ${itemsPendientes[siguienteIndice].insumo_nombre}`);
                    return;
                } else {
                    // Verificar si quedó algún insumo anterior pendiente
                    const anteriorPendiente = itemsPendientes.findIndex(
                        (it) => !nuevosComprados.includes(it.insumo_id)
                    );
                    if (anteriorPendiente !== -1) {
                        setIndiceItemActivo(anteriorPendiente);
                        notify.info(`Cargando siguiente insumo: ${itemsPendientes[anteriorPendiente].insumo_nombre}`);
                        return;
                    }
                }
            }

            // Si ya no quedan insumos pendientes o fue carga individual, navegar a la lista
            navigate("/insumos/compras");
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data || err.message || "Error al registrar compra";
            notify.error(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-compra">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap gap-2 py-3 px-3 px-md-4">
                <div className="d-flex align-items-center gap-2">
                    <FaShoppingCart size={18} />
                    <h5 className="mb-0 fw-semibold">Registrar Compra de Insumo</h5>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Link
                        to="/insumos/calculadora_compras"
                        className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                    >
                        <FaCalculator size={12} />
                        <span className="d-none d-sm-inline">Calculadora</span>
                    </Link>
                    <Link
                        to="/insumos/compras"
                        className="btn btn-sm btn-light text-primary fw-medium d-flex align-items-center gap-1"
                    >
                        <FaListAlt size={12} />
                        <span>Historial</span>
                    </Link>
                </div>
            </div>

            <div className="card-body p-3 p-md-4">
                {/* Banner de Ayuda si viene de la Calculadora de Compras */}
                {itemsPendientes.length > 0 && (
                    <div className="card border-primary border-opacity-25 bg-primary-subtle shadow-sm rounded-4 mb-4">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <FaUtensils className="text-primary" />
                                    <span className="fw-bold text-dark">
                                        Insumos de la Receta:{" "}
                                        <span className="text-primary">
                                            {recetaNombre || "Calculadora de compras"}
                                        </span>
                                    </span>
                                    {comensales && (
                                        <span className="badge bg-primary rounded-pill px-2 py-1 small">
                                            {comensales} comensales
                                        </span>
                                    )}
                                </div>
                                <span className="small text-muted fw-semibold">
                                    {compradosIds.length} de {itemsPendientes.length} registrados
                                </span>
                            </div>

                            {/* Chips de selección de insumo a cargar */}
                            <div className="d-flex flex-wrap gap-2 pt-1">
                                {itemsPendientes.map((item, idx) => {
                                    const yaComprado = compradosIds.includes(item.insumo_id);
                                    const esActivo = idx === indiceItemActivo;

                                    return (
                                        <button
                                            key={item.insumo_id}
                                            type="button"
                                            onClick={() => setIndiceItemActivo(idx)}
                                            className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 transition-all ${
                                                esActivo
                                                    ? "btn-primary shadow-sm fw-bold"
                                                    : yaComprado
                                                    ? "btn-outline-success bg-white text-success fw-medium"
                                                    : "btn-outline-secondary bg-white text-dark"
                                            }`}
                                            style={{ fontSize: "0.82rem" }}
                                        >
                                            {yaComprado && <FaCheck size={11} className="text-success" />}
                                            <span>{item.insumo_nombre}</span>
                                            <span
                                                className={`badge rounded-pill px-1 ms-1 ${
                                                    esActivo ? "bg-white text-primary" : "bg-light text-muted"
                                                }`}
                                            >
                                                {item.cantidad} {item.simbolo}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-5">
                        <div className="spinner-border text-primary mb-2" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <small className="text-muted">Cargando insumos y proveedores...</small>
                    </div>
                ) : (
                    <FormCompra
                        insumos={ins}
                        udm={unidades_de_medida}
                        proveedores={proveedores}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        prefillData={itemActual}
                    />
                )}
            </div>
        </div>
    );
};

export default RegisterCompra;