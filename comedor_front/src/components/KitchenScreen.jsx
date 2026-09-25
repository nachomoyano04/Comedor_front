import { useState, useMemo, useEffect } from "react";
import { FaUtensils, FaUsers, FaSun, FaCloudSun, FaMoon, FaCheckCircle, FaExclamationTriangle, FaTimes, FaDesktop, FaCheck, FaMinus, FaPlus, FaSearch } from "react-icons/fa";

const KitchenScreen = ({ recetas = [], insumosBD = [], onSubmit, onSwitchToStandard }) => {
    // Detectar turno sugerido según hora actual
    const getTurnoSugerido = () => {
        const hora = new Date().getHours();
        if (hora >= 6 && hora < 13) return "mañana";
        if (hora >= 13 && hora < 19) return "tarde";
        return "noche";
    };

    const [selectedRecetaId, setSelectedRecetaId] = useState(recetas.length > 0 ? recetas[0].value : null);
    const [turno, setTurno] = useState(getTurnoSugerido());
    const [comensales, setComensales] = useState(50);
    const [raciones, setRaciones] = useState(50);
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [mostrarModalConfirm, setMostrarModalConfirm] = useState(false);
    const [enviando, setEnviando] = useState(false);

    // Receta seleccionada
    const recetaActual = useMemo(() => {
        return recetas.find(r => String(r.value) === String(selectedRecetaId)) || null;
    }, [recetas, selectedRecetaId]);

    // Sincronizar raciones por defecto cuando cambia comensales si son iguales
    const handleCambiarComensales = (delta) => {
        const nuevo = Math.max(1, comensales + delta);
        setComensales(nuevo);
        setRaciones(nuevo);
    };

    const handleSetComensalesDirecto = (val) => {
        const num = Math.max(1, parseInt(val, 10) || 1);
        setComensales(num);
        setRaciones(num);
    };

    // Recetas filtradas para selección rápida táctil
    const recetasFiltradas = useMemo(() => {
        if (!filtroBusqueda.trim()) return recetas;
        return recetas.filter(r => 
            r.label?.toLowerCase().includes(filtroBusqueda.toLowerCase())
        );
    }, [recetas, filtroBusqueda]);

    // Insumos calculados y chequeo contra stock de despensa
    const insumosCalculados = useMemo(() => {
        if (!recetaActual || !recetaActual.insumos) return [];
        const baseRaciones = parseFloat(recetaActual.cuantos_comen || 1) || 1;
        const factor = raciones / baseRaciones;

        return recetaActual.insumos.map(ins => {
            const cantBase = parseFloat(ins.cantidad || 0);
            const cantRequerida = Number((cantBase * factor).toFixed(2));
            
            // Buscar stock actual en base de datos
            const insumoReal = insumosBD.find(ibd => String(ibd.id || ibd.value) === String(ins.value));
            const stockDisponible = parseFloat(insumoReal?.stock || 0);
            const stockSuficiente = stockDisponible >= cantRequerida;
            const faltante = Number((cantRequerida - stockDisponible).toFixed(2));

            return {
                value: ins.value,
                label: ins.label,
                simbolo: ins.simbolo || insumoReal?.simbolo || "u",
                cantidadRequerida: cantRequerida,
                stockDisponible,
                stockSuficiente,
                faltante: faltante > 0 ? faltante : 0
            };
        });
    }, [recetaActual, raciones, insumosBD]);

    const hayInsumosInsuficientes = useMemo(() => {
        return insumosCalculados.some(i => !i.stockSuficiente);
    }, [insumosCalculados]);

    const handleConfirmarYEnviar = async () => {
        if (!recetaActual) return;
        setEnviando(true);
        try {
            const formData = {
                receta_id: recetaActual.value,
                cantidad_producida: raciones,
                cantidad_comensales: comensales,
                turno: turno,
                insumos: insumosCalculados.map(i => ({
                    value: i.value,
                    label: i.label,
                    cantidad: i.cantidadRequerida,
                    simbolo: i.simbolo
                }))
            };
            setMostrarModalConfirm(false);
            await onSubmit(formData);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="kitchen-screen p-3 p-md-4 rounded-4 shadow-lg text-white" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", minHeight: "85vh" }}>
            {/* Barra superior de control táctil */}
            <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom border-secondary gap-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-3 bg-warning text-dark rounded-4 shadow-sm d-flex align-items-center justify-content-center" style={{ width: "56px", height: "56px" }}>
                        <FaUtensils size={28} />
                    </div>
                    <div>
                        <h3 className="mb-0 fw-bold text-white tracking-wide">PANTALLA DE COCINA</h3>
                        <small className="text-secondary fw-semibold">Modo táctil optimizado para ambiente de cocina y tablets</small>
                    </div>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <button 
                        type="button" 
                        onClick={onSwitchToStandard} 
                        className="btn btn-outline-light btn-lg px-3 py-2 fw-semibold d-flex align-items-center gap-2 rounded-3"
                        title="Cambiar a formulario estándar de oficina"
                    >
                        <FaDesktop />
                        <span className="d-none d-sm-inline">Modo Estándar</span>
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* COLUMNA IZQUIERDA: Selector de Receta */}
                <div className="col-lg-5">
                    <div className="card bg-dark border-secondary rounded-4 shadow-sm h-100">
                        <div className="card-header bg-dark border-secondary p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0 fw-bold text-info">1. ¿QUÉ SE VA A COCINAR HOY?</h5>
                                <span className="badge bg-secondary">{recetasFiltradas.length} recetas</span>
                            </div>
                            <div className="input-group">
                                <span className="input-group-text bg-secondary border-0 text-white"><FaSearch /></span>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg bg-secondary text-white border-0" 
                                    placeholder="Buscar receta rápida..." 
                                    value={filtroBusqueda}
                                    onChange={e => setFiltroBusqueda(e.target.value)}
                                />
                                {filtroBusqueda && (
                                    <button className="btn btn-secondary border-0" onClick={() => setFiltroBusqueda("")}>
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="card-body p-3" style={{ maxHeight: "580px", overflowY: "auto" }}>
                            <div className="d-flex flex-column gap-2">
                                {recetasFiltradas.map(r => {
                                    const isSelected = String(r.value) === String(selectedRecetaId);
                                    return (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setSelectedRecetaId(r.value)}
                                            className={`btn text-start p-3 rounded-4 transition-all d-flex align-items-center justify-content-between ${
                                                isSelected 
                                                    ? "btn-primary shadow-lg border-2 border-white" 
                                                    : "btn-outline-secondary text-white hover-bg-dark"
                                            }`}
                                            style={{ minHeight: "72px" }}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${isSelected ? "bg-white text-primary" : "bg-secondary text-white"}`} style={{ width: "42px", height: "42px", fontSize: "1.2rem" }}>
                                                    {r.label?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-bold fs-5 text-truncate" style={{ maxWidth: "260px" }}>{r.label}</div>
                                                    <small className={`${isSelected ? "text-light" : "text-secondary"}`}>
                                                        {r.insumos ? `${r.insumos.length} ingredientes` : "Sin ingredientes"}
                                                    </small>
                                                </div>
                                            </div>
                                            {isSelected && <FaCheckCircle size={24} className="text-white" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Turno, Raciones e Ingredientes */}
                <div className="col-lg-7">
                    <div className="d-flex flex-column gap-4">
                        {/* Selector de Turno */}
                        <div className="card bg-dark border-secondary rounded-4 p-3 shadow-sm">
                            <h5 className="fw-bold text-info mb-3">2. SELECCIONAR TURNO ESCOLAR</h5>
                            <div className="row g-2">
                                {[
                                    { id: "mañana", label: "MAÑANA", icon: FaSun, color: "btn-warning text-dark" },
                                    { id: "tarde", label: "TARDE", icon: FaCloudSun, color: "btn-info text-dark" },
                                    { id: "noche", label: "NOCHE", icon: FaMoon, color: "btn-indigo text-white" }
                                ].map(t => {
                                    const isSel = turno === t.id;
                                    const Icon = t.icon;
                                    return (
                                        <div key={t.id} className="col-4">
                                            <button
                                                type="button"
                                                onClick={() => setTurno(t.id)}
                                                className={`btn w-100 py-3 rounded-4 fw-bold d-flex flex-column align-items-center justify-content-center gap-2 border-2 ${
                                                    isSel ? `${t.color} border-white shadow-lg` : "btn-outline-secondary text-white"
                                                }`}
                                                style={{ minHeight: "80px", fontSize: "1.1rem" }}
                                            >
                                                <Icon size={26} />
                                                <span>{t.label}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cantidad de Alumnos / Raciones con Botones Táctiles Gigantes */}
                        <div className="card bg-dark border-secondary rounded-4 p-3 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold text-info mb-0">3. CANTIDAD DE COMENSALES / RACIONES</h5>
                                <span className="text-secondary fw-semibold">Ajuste rápido táctil</span>
                            </div>

                            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 my-2">
                                <button 
                                    type="button"
                                    onClick={() => handleCambiarComensales(-10)} 
                                    className="btn btn-outline-danger btn-lg p-3 rounded-4 fw-bold fs-4"
                                    style={{ minWidth: "60px", minHeight: "60px" }}
                                >
                                    -10
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleCambiarComensales(-1)} 
                                    className="btn btn-outline-secondary btn-lg p-3 rounded-4 fw-bold fs-4"
                                    style={{ minWidth: "60px", minHeight: "60px" }}
                                >
                                    <FaMinus />
                                </button>

                                <div className="text-center px-4 py-2 bg-black rounded-4 border border-secondary shadow-inner" style={{ minWidth: "160px" }}>
                                    <input 
                                        type="number" 
                                        min="1"
                                        className="form-control text-center bg-transparent border-0 text-warning fw-bolder fs-1 p-0"
                                        value={comensales}
                                        onChange={e => handleSetComensalesDirecto(e.target.value)}
                                        style={{ width: "120px", margin: "0 auto" }}
                                    />
                                    <small className="text-light text-uppercase fw-bold letter-spacing-1">Platos / Alumnos</small>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => handleCambiarComensales(1)} 
                                    className="btn btn-outline-secondary btn-lg p-3 rounded-4 fw-bold fs-4"
                                    style={{ minWidth: "60px", minHeight: "60px" }}
                                >
                                    <FaPlus />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleCambiarComensales(10)} 
                                    className="btn btn-outline-success btn-lg p-3 rounded-4 fw-bold fs-4"
                                    style={{ minWidth: "60px", minHeight: "60px" }}
                                >
                                    +10
                                </button>
                            </div>

                            {/* Accesos rápidos a tamaños estándar escolares */}
                            <div className="d-flex flex-wrap justify-content-center gap-2 mt-3 pt-3 border-top border-secondary">
                                {[25, 50, 100, 150, 200, 250].map(cant => (
                                    <button
                                        key={cant}
                                        type="button"
                                        onClick={() => handleSetComensalesDirecto(cant)}
                                        className={`btn btn-sm rounded-pill px-3 py-2 fw-bold ${comensales === cant ? "btn-warning text-dark" : "btn-secondary text-white"}`}
                                    >
                                        {cant} alumnos
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Ingredientes necesarios y Stock en Despensa */}
                        <div className="card bg-dark border-secondary rounded-4 p-3 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold text-info mb-0">4. INGREDIENTES A DESCONTAR DEL STOCK</h5>
                                    <small className="text-secondary">Verificación automática de stock disponible en despensa</small>
                                </div>
                                {hayInsumosInsuficientes ? (
                                    <span className="badge bg-danger p-2 fs-6 d-flex align-items-center gap-1">
                                        <FaExclamationTriangle /> Stock insuficiente
                                    </span>
                                ) : (
                                    <span className="badge bg-success p-2 fs-6 d-flex align-items-center gap-1">
                                        <FaCheck /> Stock completo OK
                                    </span>
                                )}
                            </div>

                            <div className="list-group list-group-flush rounded-4 overflow-hidden border border-secondary" style={{ maxHeight: "240px", overflowY: "auto" }}>
                                {insumosCalculados.length === 0 ? (
                                    <div className="p-4 text-center text-secondary">
                                        Seleccione una receta para calcular los ingredientes necesarios.
                                    </div>
                                ) : (
                                    insumosCalculados.map(i => (
                                        <div 
                                            key={i.value} 
                                            className={`list-group-item d-flex justify-content-between align-items-center p-3 ${
                                                i.stockSuficiente 
                                                    ? "bg-dark text-white border-secondary" 
                                                    : "bg-danger bg-opacity-25 text-white border-danger"
                                            }`}
                                        >
                                            <div>
                                                <div className="fw-bold fs-6">{i.label}</div>
                                                <small className="text-secondary">
                                                    Stock en despensa: <strong>{i.stockDisponible} {i.simbolo}</strong>
                                                </small>
                                            </div>

                                            <div className="text-end">
                                                <div className="fw-bolder fs-5 text-warning">
                                                    {i.cantidadRequerida} {i.simbolo}
                                                </div>
                                                {!i.stockSuficiente && (
                                                    <small className="text-danger fw-bold">
                                                        ⚠️ Faltan {i.faltante} {i.simbolo}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Botón Gigante de Confirmación */}
                        <div className="pt-2">
                            <button
                                type="button"
                                disabled={!recetaActual || enviando}
                                onClick={() => setMostrarModalConfirm(true)}
                                className="btn btn-success btn-lg w-100 py-3 rounded-4 shadow-lg fw-bold d-flex align-items-center justify-content-center gap-3 border-2 border-white"
                                style={{ minHeight: "75px", fontSize: "1.4rem", letterSpacing: "0.5px" }}
                            >
                                <FaCheckCircle size={32} />
                                <span>¡REGISTRAR PRODUCCIÓN AHORA!</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL TÁCTIL DE CONFIRMACIÓN */}
            {mostrarModalConfirm && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark text-white border-2 border-primary rounded-4 shadow-2xl p-3">
                            <div className="modal-header border-0 pb-0">
                                <h3 className="modal-title fw-bold text-warning d-flex align-items-center gap-2">
                                    <FaExclamationTriangle /> CONFIRMAR PRODUCCIÓN
                                </h3>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarModalConfirm(false)}></button>
                            </div>
                            <div className="modal-body py-4 fs-5">
                                <div className="p-3 bg-black rounded-4 mb-3 border border-secondary">
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <span className="text-secondary d-block">Receta a preparar:</span>
                                            <strong className="fs-4 text-info">{recetaActual?.label}</strong>
                                        </div>
                                        <div className="col-sm-6">
                                            <span className="text-secondary d-block">Turno:</span>
                                            <strong className="fs-4 text-capitalize text-warning">{turno}</strong>
                                        </div>
                                        <div className="col-sm-6">
                                            <span className="text-secondary d-block">Raciones a producir:</span>
                                            <strong className="fs-4 text-white">{raciones} platos</strong>
                                        </div>
                                        <div className="col-sm-6">
                                            <span className="text-secondary d-block">Comensales registrados:</span>
                                            <strong className="fs-4 text-white">{comensales} alumnos</strong>
                                        </div>
                                    </div>
                                </div>

                                {hayInsumosInsuficientes && (
                                    <div className="alert alert-warning border-0 rounded-4 p-3 mb-3 d-flex align-items-center gap-3">
                                        <FaExclamationTriangle size={36} className="text-warning flex-shrink-0" />
                                        <div>
                                            <strong className="d-block text-dark">ADVERTENCIA DE STOCK EN DESPENSA:</strong>
                                            <span className="text-dark small">
                                                Uno o más insumos superan el stock físico disponible en el sistema. Al confirmar, el stock quedará en <strong>cero o negativo</strong> y se generará una alerta de reposición.
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-secondary mb-0 text-center">
                                    ¿Está seguro de que desea confirmar? El sistema descontará automáticamente los insumos utilizados de la despensa.
                                </p>
                            </div>

                            <div className="modal-footer border-0 pt-0 d-flex gap-3">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-lg flex-grow-1 py-3 rounded-4 fw-bold fs-5"
                                    onClick={() => setMostrarModalConfirm(false)}
                                    disabled={enviando}
                                >
                                    CANCELAR
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-success btn-lg flex-grow-1 py-3 rounded-4 fw-bold fs-5 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleConfirmarYEnviar}
                                    disabled={enviando}
                                >
                                    {enviando ? "REGISTRANDO..." : "SÍ, REGISTRAR PRODUCCIÓN"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenScreen;
