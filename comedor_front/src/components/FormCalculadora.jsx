import { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { notify } from "../utils/notify";
import {
    FaCalculator,
    FaUsers,
    FaShoppingCart,
    FaCheckCircle,
    FaDollarSign,
    FaCopy,
    FaPrint,
    FaRedo,
    FaWarehouse,
    FaUtensils,
    FaInfoCircle,
    FaArrowRight,
    FaLayerGroup
} from "react-icons/fa";

const PRESETS_COMENSALES = [25, 50, 100, 150, 200, 300, 500];

const FormCalculadora = ({ recetas = [] }) => {
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
    const [cantidadC, setCantidadC] = useState(50);
    const [descontarStock, setDescontarStock] = useState(true);
    const [ajustesManuales, setAjustesManuales] = useState({});

    // Cuando cambia la receta seleccionada, sugerir su cantidad de comensales base si es válida
    const handleSelectReceta = (option) => {
        setRecetaSeleccionada(option);
        setAjustesManuales({});
        if (option && option.cuantos_comen) {
            setCantidadC(option.cuantos_comen);
        }
    };

    // Cambiar la cantidad de comensales
    const handleCantidadComensales = (valor) => {
        const val = parseInt(valor, 10);
        if (isNaN(val)) {
            setCantidadC("");
        } else {
            setCantidadC(Math.max(1, val));
        }
    };

    const handleIncrementarComensales = (delta) => {
        setCantidadC((prev) => {
            const actual = parseInt(prev, 10) || 0;
            return Math.max(1, actual + delta);
        });
    };

    // Modificar individualmente la cantidad a comprar de un insumo
    const handleAjusteManualInsumo = (insumoId, valor) => {
        setAjustesManuales((prev) => ({
            ...prev,
            [insumoId]: valor
        }));
    };

    // Restaurar cantidad calculada para un insumo individual
    const handleResetInsumo = (insumoId) => {
        setAjustesManuales((prev) => {
            const copia = { ...prev };
            delete copia[insumoId];
            return copia;
        });
    };

    // Limpiar formulario completo
    const handleLimpiarTodo = () => {
        setRecetaSeleccionada(null);
        setCantidadC(50);
        setDescontarStock(true);
        setAjustesManuales({});
    };

    // Restablecer todas las cantidades a los valores automáticos
    const handleRestablecerValores = () => {
        setAjustesManuales({});
        notify.info("Cantidades restauradas", "Se recalculó según la proporción exacta de la receta.");
    };

    // Formatear monedas y números en formato es-AR
    const formatearMoneda = (monto) => {
        const valor = Number(monto || 0).toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `$\u00A0${valor}`;
    };

    const formatearNumero = (num, decimales = 2) => {
        return Number(num || 0).toLocaleString("es-AR", {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        });
    };

    // Cálculo reactivo de ingredientes
    const { insumosCalculados, factorEscala, totalPresupuesto, insumosAComprarCount, insumosCubiertosCount } = useMemo(() => {
        if (!recetaSeleccionada || !Array.isArray(recetaSeleccionada.insumos)) {
            return {
                insumosCalculados: [],
                factorEscala: 1,
                totalPresupuesto: 0,
                insumosAComprarCount: 0,
                insumosCubiertosCount: 0
            };
        }

        const comensales = parseInt(cantidadC, 10) || 1;
        const baseComensales = parseFloat(recetaSeleccionada.cuantos_comen) || 1;
        const factor = comensales / baseComensales;

        let totalGasto = 0;
        let countAComprar = 0;
        let countCubiertos = 0;

        const calculados = recetaSeleccionada.insumos.map((item) => {
            const cantidadBase = parseFloat(item.cantidad_base) || 0;
            const requerido = factor * cantidadBase;
            const stockActual = parseFloat(item.stock_actual) || 0;
            const stockDisponible = Math.max(0, stockActual);

            // Cálculo automático según toggle de stock
            let aComprarCalculado = descontarStock
                ? Math.max(0, requerido - stockDisponible)
                : requerido;

            aComprarCalculado = Math.round(aComprarCalculado * 100) / 100;

            // Revisar si el usuario modificó manualmente este insumo
            const tieneModificacion = Object.prototype.hasOwnProperty.call(ajustesManuales, item.insumo_id);
            const valorManual = ajustesManuales[item.insumo_id];

            let aComprarFinal = aComprarCalculado;
            if (tieneModificacion && valorManual !== "") {
                const numManual = parseFloat(valorManual);
                aComprarFinal = !isNaN(numManual) ? Math.max(0, numManual) : 0;
            }

            const precioUnit = parseFloat(item.precio_unitario) || 0;
            const subtotal = aComprarFinal * precioUnit;
            totalGasto += subtotal;

            if (aComprarFinal > 0) {
                countAComprar += 1;
            } else {
                countCubiertos += 1;
            }

            return {
                ...item,
                requerido,
                stock_actual: stockActual,
                a_comprar_calculado: aComprarCalculado,
                a_comprar: aComprarFinal,
                es_modificado: tieneModificacion,
                subtotal,
                cubierto: aComprarFinal <= 0
            };
        });

        return {
            insumosCalculados: calculados,
            factorEscala: factor,
            totalPresupuesto: totalGasto,
            insumosAComprarCount: countAComprar,
            insumosCubiertosCount: countCubiertos
        };
    }, [recetaSeleccionada, cantidadC, descontarStock, ajustesManuales]);

    // Copiar lista formateada al portapapeles para WhatsApp o Proveedores
    const handleCopiarLista = async () => {
        if (!recetaSeleccionada || !insumosCalculados.length) return;

        const fechaHoy = new Date().toLocaleDateString("es-AR");
        const aComprar = insumosCalculados.filter((i) => i.a_comprar > 0);

        let texto = `📋 *LISTA DE COMPRAS - ${recetaSeleccionada.label.toUpperCase()}*\n`;
        texto += `👥 *Comensales:* ${cantidadC}\n`;
        texto += `📅 *Fecha:* ${fechaHoy}\n`;
        texto += `📦 *Cálculo:* ${descontarStock ? "Descontando stock actual en despensa" : "Receta completa sin descontar stock"}\n`;
        texto += `─────────────────────────\n`;

        if (aComprar.length === 0) {
            texto += `✅ ¡No se requiere comprar nada! Todo está cubierto con el stock actual.\n`;
        } else {
            texto += `🛒 *INSUMOS A COMPRAR (${aComprar.length}):*\n\n`;
            aComprar.forEach((item, idx) => {
                const cantStr = `${formatearNumero(item.a_comprar)} ${item.simbolo || ""}`.trim();
                const subStr = item.subtotal > 0 ? ` ➔ Est: ${formatearMoneda(item.subtotal)}` : "";
                const provStr = item.proveedor ? ` (Prov: ${item.proveedor})` : "";
                texto += `${idx + 1}. *${item.label}*: ${cantStr}${subStr}${provStr}\n`;
            });
        }

        if (totalPresupuesto > 0) {
            texto += `─────────────────────────\n`;
            texto += `💰 *Presupuesto Estimado Total:* ${formatearMoneda(totalPresupuesto)}\n`;
        }

        try {
            await navigator.clipboard.writeText(texto);
            notify.success("¡Lista copiada!", "La lista de compras ya está en tu portapapeles para pegarla en WhatsApp.");
        } catch {
            notify.error("No se pudo copiar automáticamente al portapapeles.");
        }
    };

    // Imprimir reporte limpio
    const handleImprimir = () => {
        window.print();
    };

    // Preparar opciones de recetas enriquecidas para react-select
    const optionsRecetas = useMemo(() => {
        return (recetas || []).map((r) => ({
            ...r,
            value: r.value || r.id,
            label: r.label || r.nombre
        }));
    }, [recetas]);

    return (
        <div className="form-calculadora">
            {/* Panel Superior: Selección de Receta y Controles */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white overflow-hidden">
                <div className="card-body p-3 p-md-4">
                    <div className="row g-3 align-items-center">
                        {/* Selector de Receta */}
                        <div className="col-12 col-lg-6">
                            <label className="form-label fw-bold d-flex align-items-center gap-2 mb-2 text-dark">
                                <FaUtensils className="text-primary" />
                                <span>Seleccionar Receta del Menú</span>
                            </label>
                            <Select
                                value={recetaSeleccionada}
                                onChange={handleSelectReceta}
                                options={optionsRecetas}
                                placeholder="Escribí o seleccioná una receta..."
                                isClearable
                                classNamePrefix="react-select"
                                noOptionsMessage={() => "No se encontraron recetas activas"}
                                formatOptionLabel={(option) => (
                                    <div className="d-flex justify-content-between align-items-center py-1">
                                        <span className="fw-semibold text-dark">{option.label}</span>
                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 ms-2">
                                            Rinde {option.cuantos_comen} {option.cuantos_comen === 1 ? "comensal" : "comensales"}
                                        </span>
                                    </div>
                                )}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderRadius: "0.65rem",
                                        borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
                                        boxShadow: state.isFocused ? "0 0 0 3px rgba(37, 99, 235, 0.15)" : "none",
                                        minHeight: "46px"
                                    })
                                }}
                            />
                            {recetaSeleccionada && (
                                <div className="mt-2 text-muted small d-flex align-items-center gap-2">
                                    <span className="badge bg-light text-secondary border">
                                        Base: {recetaSeleccionada.cuantos_comen} comensales
                                    </span>
                                    <span className="badge bg-light text-secondary border">
                                        {recetaSeleccionada.insumos?.length || 0} insumos registrados
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Cantidad de Comensales */}
                        <div className="col-12 col-lg-6">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label fw-bold d-flex align-items-center gap-2 mb-0 text-dark">
                                    <FaUsers className="text-primary" />
                                    <span>Comensales a Servir</span>
                                </label>
                                {recetaSeleccionada && (
                                    <span className="badge bg-info-subtle text-info-emphasis rounded-pill px-2 py-1 small fw-semibold">
                                        Factor: {factorEscala.toFixed(2)}x
                                    </span>
                                )}
                            </div>

                            <div className="input-group mb-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-3"
                                    onClick={() => handleIncrementarComensales(-10)}
                                    title="Restar 10 comensales"
                                    disabled={!recetaSeleccionada || cantidadC <= 10}
                                >
                                    -10
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="form-control form-control-lg text-center fw-bold text-primary"
                                    value={cantidadC}
                                    onChange={(e) => handleCantidadComensales(e.target.value)}
                                    placeholder="Ej: 150"
                                    disabled={!recetaSeleccionada}
                                    style={{ fontSize: "1.25rem" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-3"
                                    onClick={() => handleIncrementarComensales(10)}
                                    title="Sumar 10 comensales"
                                    disabled={!recetaSeleccionada}
                                >
                                    +10
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-3"
                                    onClick={() => handleIncrementarComensales(50)}
                                    title="Sumar 50 comensales"
                                    disabled={!recetaSeleccionada}
                                >
                                    +50
                                </button>
                            </div>

                            {/* Botones Presets Rápidos */}
                            <div className="d-flex flex-wrap align-items-center gap-1">
                                <small className="text-muted me-1 fw-semibold">Rápido:</small>
                                {PRESETS_COMENSALES.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setCantidadC(preset)}
                                        disabled={!recetaSeleccionada}
                                        className={`btn btn-sm py-0 px-2 rounded-pill ${
                                            parseInt(cantidadC, 10) === preset
                                                ? "btn-primary fw-bold"
                                                : "btn-outline-secondary"
                                        }`}
                                        style={{ fontSize: "0.75rem" }}
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Toggle de Descuento de Stock y Botones de Control */}
                    {recetaSeleccionada && (
                        <div className="row g-3 align-items-center mt-3 pt-3 border-top">
                            <div className="col-12 col-md-7">
                                <div className="form-check form-switch d-flex align-items-center gap-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="switchDescontarStock"
                                        checked={descontarStock}
                                        onChange={(e) => setDescontarStock(e.target.checked)}
                                        style={{ width: "2.8rem", height: "1.4rem", cursor: "pointer" }}
                                    />
                                    <label
                                        className="form-check-label user-select-none cursor-pointer ms-1"
                                        htmlFor="switchDescontarStock"
                                    >
                                        <span className="fw-bold d-block text-dark" style={{ fontSize: "0.95rem" }}>
                                            Descontar stock disponible en despensa
                                        </span>
                                        <small className="text-muted d-block" style={{ fontSize: "0.82rem" }}>
                                            {descontarStock
                                                ? "Calcula solo el faltante neto considerando lo que ya tenés guardado."
                                                : "Calcula la compra bruta total de la receta sin descontar despensa."}
                                        </small>
                                    </label>
                                </div>
                            </div>

                            <div className="col-12 col-md-5 d-flex justify-content-md-end align-items-center gap-2 flex-wrap">
                                {Object.keys(ajustesManuales).length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleRestablecerValores}
                                        className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                                        title="Deshacer cambios manuales en la tabla"
                                    >
                                        <FaRedo size={11} />
                                        <span>Restaurar cantidades</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleLimpiarTodo}
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                >
                                    <span>Limpiar</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Si no hay receta seleccionada, mostrar Empty State Amigable */}
            {!recetaSeleccionada ? (
                <div className="card border-0 shadow-sm rounded-4 text-center p-4 p-md-5 my-3 bg-white">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary mx-auto mb-3 shadow-sm"
                        style={{ width: "72px", height: "72px", fontSize: "1.8rem" }}
                    >
                        <FaCalculator />
                    </div>
                    <h4 className="fw-bold text-dark mb-2">Calculá tus compras de forma inteligente</h4>
                    <p className="text-muted mx-auto mb-3" style={{ maxWidth: "520px", fontSize: "0.95rem" }}>
                        Seleccioná una receta del menú arriba y definí cuántos comensales vas a recibir. La calculadora
                        escalará automáticamente los ingredientes, chequeará tu despensa y te dirá exactamente cuánto comprar y cuánto gastarás.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                            ✓ Escala proporcional exacta
                        </span>
                        <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                            ✓ Descuento automático de despensa
                        </span>
                        <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                            ✓ Estimación presupuestaria al día
                        </span>
                    </div>
                </div>
            ) : insumosCalculados.length === 0 ? (
                <div className="alert alert-warning rounded-4 shadow-sm py-4 text-center">
                    <FaInfoCircle size={24} className="mb-2 d-block mx-auto text-warning" />
                    <h5 className="fw-bold mb-1">La receta seleccionada no tiene ingredientes registrados</h5>
                    <p className="mb-0 text-muted small">
                        Podés editar esta receta en la sección de Recetas para asociarle los insumos requeridos.
                    </p>
                </div>
            ) : (
                /* Resultados: Tarjetas KPI, Tabla y Acciones */
                <div className="calculadora-resultados">
                    {/* Tarjetas KPI de Resumen */}
                    <div className="row g-3 mb-4">
                        {/* KPI 1: Comensales */}
                        <div className="col-6 col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-bold text-uppercase">Comensales</span>
                                        <span className="badge bg-primary-subtle text-primary rounded-circle p-2">
                                            <FaUsers size={14} />
                                        </span>
                                    </div>
                                    <div className="fs-3 fw-bold text-dark mb-0">{cantidadC}</div>
                                    <small className="text-muted">
                                        Rinde base: {recetaSeleccionada.cuantos_comen}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* KPI 2: Insumos a Comprar */}
                        <div className="col-6 col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-bold text-uppercase">A Comprar</span>
                                        <span className="badge bg-warning-subtle text-warning-emphasis rounded-circle p-2">
                                            <FaShoppingCart size={14} />
                                        </span>
                                    </div>
                                    <div className="fs-3 fw-bold text-warning-emphasis mb-0">
                                        {insumosAComprarCount}
                                        <span className="fs-6 text-muted fw-normal ms-1">/ {insumosCalculados.length}</span>
                                    </div>
                                    <small className="text-muted">Insumos con faltante</small>
                                </div>
                            </div>
                        </div>

                        {/* KPI 3: Insumos Cubiertos */}
                        <div className="col-6 col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-bold text-uppercase">En Despensa</span>
                                        <span className="badge bg-success-subtle text-success rounded-circle p-2">
                                            <FaCheckCircle size={14} />
                                        </span>
                                    </div>
                                    <div className="fs-3 fw-bold text-success mb-0">{insumosCubiertosCount}</div>
                                    <small className="text-muted">Stock suficiente cubierto</small>
                                </div>
                            </div>
                        </div>

                        {/* KPI 4: Presupuesto Estimado */}
                        <div className="col-6 col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                                <div className="card-body p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="text-muted small fw-bold text-uppercase">Presupuesto Est.</span>
                                        <span className="badge bg-info-subtle text-info-emphasis rounded-circle p-2">
                                            <FaDollarSign size={14} />
                                        </span>
                                    </div>
                                    <div className="fs-3 fw-bold text-primary text-nowrap mb-0">
                                        {formatearMoneda(totalPresupuesto)}
                                    </div>
                                    <small className="text-muted">Precios de lista vigentes</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de Acciones de Lista */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 no-print">
                        <div className="d-flex align-items-center gap-2">
                            <h6 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2">
                                <FaLayerGroup className="text-primary" />
                                <span>Detalle de Insumos para "{recetaSeleccionada.label}"</span>
                            </h6>
                            <span className="badge bg-secondary-subtle text-secondary rounded-pill">
                                {insumosCalculados.length} productos
                            </span>
                        </div>

                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={handleCopiarLista}
                                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 fw-semibold shadow-sm"
                                title="Copiar lista de compras formateada para WhatsApp"
                            >
                                <FaCopy size={13} />
                                <span>Copiar para WhatsApp</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleImprimir}
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 fw-semibold shadow-sm"
                                title="Imprimir lista de compras"
                            >
                                <FaPrint size={13} />
                                <span className="d-none d-sm-inline">Imprimir</span>
                            </button>

                            <Link
                                to="/insumos/nueva_compra"
                                className="btn btn-sm btn-primary d-flex align-items-center gap-2 fw-semibold shadow-sm"
                            >
                                <FaShoppingCart size={13} />
                                <span>Registrar Compra</span>
                                <FaArrowRight size={11} />
                            </Link>
                        </div>
                    </div>

                    {/* Tabla de Insumos */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light border-bottom text-secondary">
                                    <tr style={{ fontSize: "0.8rem", letterSpacing: "0.03em" }}>
                                        <th className="py-3 px-3">INSUMO</th>
                                        <th className="py-3 px-3 text-end text-nowrap">RECETA BRUTA</th>
                                        <th className="py-3 px-3 text-end text-nowrap">STOCK EN DESPENSA</th>
                                        <th className="py-3 px-3 text-end text-nowrap" style={{ minWidth: "160px" }}>
                                            A COMPRAR
                                        </th>
                                        <th className="py-3 px-3 text-end text-nowrap">PRECIO UNIT. / PROV.</th>
                                        <th className="py-3 px-3 text-end text-nowrap">SUBTOTAL EST.</th>
                                        <th className="py-3 px-3 text-center text-nowrap">ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {insumosCalculados.map((item) => {
                                        const tieneStockSuficiente = item.stock_actual >= item.requerido;
                                        const tieneStockParcial = item.stock_actual > 0 && item.stock_actual < item.requerido;
                                        const sinStock = item.stock_actual <= 0;

                                        return (
                                            <tr key={item.insumo_id} className={item.cubierto ? "table-light-subtle" : ""}>
                                                {/* Insumo */}
                                                <td className="py-2 px-3">
                                                    <div className="fw-bold text-dark">{item.label}</div>
                                                    <small className="text-muted d-block">
                                                        Unidad: <span className="fw-medium">{item.simbolo || "u"}</span>
                                                    </small>
                                                </td>

                                                {/* Requerido Bruto */}
                                                <td className="py-2 px-3 text-end text-nowrap">
                                                    <span className="fw-semibold text-secondary">
                                                        {formatearNumero(item.requerido)}{" "}
                                                        <small className="text-muted">{item.simbolo}</small>
                                                    </span>
                                                </td>

                                                {/* Stock en Despensa */}
                                                <td className="py-2 px-3 text-end text-nowrap">
                                                    <span
                                                        className={`badge rounded-pill px-2 py-1 fw-semibold ${
                                                            tieneStockSuficiente
                                                                ? "bg-success-subtle text-success border border-success-subtle"
                                                                : tieneStockParcial
                                                                ? "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                                                                : "bg-danger-subtle text-danger border border-danger-subtle"
                                                        }`}
                                                        title={`Stock actual en base de datos: ${item.stock_actual} ${item.simbolo}`}
                                                    >
                                                        <FaWarehouse size={10} className="me-1" />
                                                        {formatearNumero(item.stock_actual)} {item.simbolo}
                                                    </span>
                                                </td>

                                                {/* Cantidad A Comprar (Editable) */}
                                                <td className="py-2 px-3 text-end">
                                                    <div className="d-flex align-items-center justify-content-end gap-1">
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            min="0"
                                                            value={item.a_comprar}
                                                            onChange={(e) =>
                                                                handleAjusteManualInsumo(item.insumo_id, e.target.value)
                                                            }
                                                            className={`form-control form-control-sm text-end fw-bold ${
                                                                item.es_modificado
                                                                    ? "border-warning bg-warning-subtle text-dark"
                                                                    : item.a_comprar > 0
                                                                    ? "border-primary text-primary"
                                                                    : "border-secondary-subtle text-muted"
                                                            }`}
                                                            style={{ width: "95px" }}
                                                            title={
                                                                item.es_modificado
                                                                    ? `Modificado manualmente. Calculado originalmente: ${formatearNumero(
                                                                          item.a_comprar_calculado
                                                                      )}`
                                                                    : "Podés ajustar manualmente la cantidad si deseás comprar de más"
                                                            }
                                                        />
                                                        <span
                                                            className="text-muted small fw-medium"
                                                            style={{ width: "30px", textAlign: "left" }}
                                                        >
                                                            {item.simbolo}
                                                        </span>
                                                        {item.es_modificado && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleResetInsumo(item.insumo_id)}
                                                                className="btn btn-sm btn-link p-0 text-secondary"
                                                                title="Restaurar al cálculo automático"
                                                            >
                                                                <FaRedo size={10} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Precio Unitario / Proveedor */}
                                                <td className="py-2 px-3 text-end text-nowrap">
                                                    {item.precio_unitario > 0 ? (
                                                        <div>
                                                            <div className="fw-semibold text-dark">
                                                                {formatearMoneda(item.precio_unitario)}
                                                            </div>
                                                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "150px" }}>
                                                                {item.proveedor || "Sin proveedor"}
                                                            </small>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted fst-italic small">Sin precio reg.</span>
                                                    )}
                                                </td>

                                                {/* Subtotal Estimado */}
                                                <td className="py-2 px-3 text-end text-nowrap">
                                                    <span
                                                        className={`fw-bold ${
                                                            item.subtotal > 0 ? "text-primary" : "text-muted"
                                                        }`}
                                                    >
                                                        {formatearMoneda(item.subtotal)}
                                                    </span>
                                                </td>

                                                {/* Estado Badge */}
                                                <td className="py-2 px-3 text-center text-nowrap">
                                                    {item.cubierto ? (
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 fw-semibold">
                                                            <FaCheckCircle size={10} className="me-1" />
                                                            Cubierto
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2 py-1 fw-semibold">
                                                            <FaShoppingCart size={10} className="me-1" />
                                                            Comprar
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot className="table-light border-top">
                                    <tr>
                                        <td colSpan={5} className="py-3 px-3 text-end fw-bold text-dark">
                                            TOTAL ESTIMADO A COMPRAR:
                                        </td>
                                        <td className="py-3 px-3 text-end fw-bold text-primary fs-6 text-nowrap">
                                            {formatearMoneda(totalPresupuesto)}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="badge bg-primary rounded-pill px-2 py-1">
                                                {insumosAComprarCount} {insumosAComprarCount === 1 ? "insumo" : "insumos"}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormCalculadora;