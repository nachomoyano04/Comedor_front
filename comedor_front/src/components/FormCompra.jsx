import { useState, useEffect } from "react";
import Select from "react-select";
import notify from "../utils/notify";
import { FaCalendarAlt } from "react-icons/fa";

// Formatear monedas en pesos argentinos: $ 1.250,50 (con . para miles y , para decimales)
const formatearMoneda = (monto) => {
    const valor = Number(monto || 0).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `$\u00A0${valor}`;
};

// Helpers de fecha en formato DD/MM/YY
const formatearFechaDDMMYY = (yyyy, mm, dd) => {
    const yy = String(yyyy).slice(-2);
    return `${String(dd).padStart(2, "0")}/${String(mm).padStart(2, "0")}/${yy}`;
};

const getPartesFechaHoraActual = () => {
    const ahora = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = ahora.getFullYear();
    const mm = pad(ahora.getMonth() + 1);
    const dd = pad(ahora.getDate());
    const hh = pad(ahora.getHours());
    const min = pad(ahora.getMinutes());
    return {
        fechaDDMMYY: formatearFechaDDMMYY(yyyy, mm, dd),
        fechaISO: `${yyyy}-${mm}-${dd}`,
        hora: `${hh}:${min}`,
        isoCompleto: `${yyyy}-${mm}-${dd}T${hh}:${min}`
    };
};

const parseISOTOPartes = (isoStr) => {
    if (!isoStr) return getPartesFechaHoraActual();
    const cleaned = String(isoStr).replace(" ", "T");
    const [datePart, timePart = "00:00"] = cleaned.split("T");
    const [yyyy, mm, dd] = (datePart || "").split("-");
    const hora = timePart.slice(0, 5) || "00:00";
    if (yyyy && mm && dd) {
        return {
            fechaDDMMYY: formatearFechaDDMMYY(yyyy, mm, dd),
            fechaISO: `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`,
            hora: hora,
            isoCompleto: `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}T${hora}`
        };
    }
    return getPartesFechaHoraActual();
};

const FormCompra = ({
    onSubmit,
    udm = [],
    insumos = [],
    proveedores = [],
    submitting = false,
    prefillData = null
}) => {
    const inicialPartes = getPartesFechaHoraActual();

    const [formData, setFormData] = useState({
        insumo_id: "",
        proveedor_id: "",
        insumo_nombre: "",
        proveedor_razon_social: "",
        precio_unitario: "",
        fecha_desde: inicialPartes.isoCompleto,
        fecha_vencimiento: "",
        cantidad: 1,
        precio_total: 0
    });

    const [udmInsumoActual, setUdmInsumoActual] = useState("");

    // Estados para la fecha en formato DD/MM/YY y hora nativa
    const [fechaInput, setFechaInput] = useState(inicialPartes.fechaDDMMYY);
    const [horaInput, setHoraInput] = useState(inicialPartes.hora);
    const [fechaISOPicker, setFechaISOPicker] = useState(inicialPartes.fechaISO);

    // Efecto de inicialización y pre-relleno automático
    useEffect(() => {
        if (!prefillData) {
            return;
        }

        const insumoId = prefillData.insumo_id || "";
        const insumoObj = (insumos || []).find((i) => String(i.value) === String(insumoId));
        const insumoNombre = insumoObj?.label || prefillData.insumo_nombre || "";

        // Buscar proveedor correspondiente por ID o por razón social
        let proveedorId = prefillData.proveedor_id || "";
        let proveedorNombre = prefillData.proveedor_razon_social || "";

        if (proveedorNombre && !proveedorId) {
            const matchProv = (proveedores || []).find(
                (p) => p.label.toLowerCase().trim() === proveedorNombre.toLowerCase().trim()
            );
            if (matchProv) {
                proveedorId = matchProv.value;
                proveedorNombre = matchProv.label;
            }
        } else if (proveedorId && !proveedorNombre) {
            const matchProv = (proveedores || []).find(
                (p) => String(p.value) === String(proveedorId)
            );
            if (matchProv) {
                proveedorNombre = matchProv.label;
            }
        }

        const cantidad = parseFloat(prefillData.cantidad) || 1;
        const precioUnit = parseFloat(prefillData.precio_unitario) || 0;
        const precioTotal = (cantidad * precioUnit).toFixed(2);

        // Si prefillData tiene una fecha especificada, sincronizarla
        let partesFecha = inicialPartes;
        if (prefillData.fecha_desde) {
            partesFecha = parseISOTOPartes(prefillData.fecha_desde);
            setFechaInput(partesFecha.fechaDDMMYY);
            setHoraInput(partesFecha.hora);
            setFechaISOPicker(partesFecha.fechaISO);
        }

        setFormData((prev) => ({
            ...prev,
            insumo_id: insumoId,
            insumo_nombre: insumoNombre,
            proveedor_id: proveedorId,
            proveedor_razon_social: proveedorNombre,
            cantidad: cantidad,
            precio_unitario: precioUnit > 0 ? precioUnit : "",
            precio_total: precioTotal > 0 ? precioTotal : 0,
            fecha_desde: partesFecha.isoCompleto
        }));

        if (insumoObj?.id_udm) {
            setUdmInsumoActual(udm.find((u) => u.id == insumoObj.id_udm) || "");
        }
    }, [prefillData, insumos, proveedores, udm]);

    // Manejo de escritura manual en input DD/MM/YY
    const handleFechaInputChange = (e) => {
        let val = e.target.value.replace(/\D/g, ""); // Solo dígitos
        if (val.length > 6) val = val.slice(0, 6);

        let formateado = val;
        if (val.length > 2 && val.length <= 4) {
            formateado = `${val.slice(0, 2)}/${val.slice(2)}`;
        } else if (val.length > 4) {
            formateado = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4)}`;
        }

        setFechaInput(formateado);

        // Si se completaron los 6 dígitos (DD/MM/YY)
        if (val.length === 6) {
            const dd = val.slice(0, 2);
            const mm = val.slice(2, 4);
            const yy = val.slice(4, 6);
            const yyyy = `20${yy}`;
            const iso = `${yyyy}-${mm}-${dd}`;
            setFechaISOPicker(iso);
            setFormData((prev) => ({
                ...prev,
                fecha_desde: `${iso}T${horaInput}`
            }));
        }
    };

    // Manejo de selección en el Datepicker nativo (calendario)
    const handlePickerDateChange = (e) => {
        const iso = e.target.value; // Formato YYYY-MM-DD
        if (!iso) return;
        const [yyyy, mm, dd] = iso.split("-");
        const ddmmyy = formatearFechaDDMMYY(yyyy, mm, dd);
        setFechaISOPicker(iso);
        setFechaInput(ddmmyy);
        setFormData((prev) => ({
            ...prev,
            fecha_desde: `${iso}T${horaInput}`
        }));
    };

    // Manejo de cambio en la hora
    const handleHoraInputChange = (e) => {
        const hora = e.target.value;
        setHoraInput(hora);
        setFormData((prev) => ({
            ...prev,
            fecha_desde: `${fechaISOPicker}T${hora}`
        }));
    };

    const handleChange = (e) => {
        if (e.target) {
            const { name, value } = e.target;
            setFormData((prev) => {
                const formUpdated = { ...prev, [name]: value };
                if (name === "cantidad" || name === "precio_unitario") {
                    const cantidad = parseFloat(String(formUpdated.cantidad).replace(",", ".")) || 0;
                    const precio_unitario = parseFloat(String(formUpdated.precio_unitario).replace(",", ".")) || 0;
                    formUpdated.precio_total = (cantidad * precio_unitario).toFixed(2);
                }
                return formUpdated;
            });
        } else {
            const { name, value, label } = e;
            if (name === "insumo_id") {
                setUdmInsumoActual(udm.find((u) => u.id == e.id_udm) || "");
            }
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                [name === "insumo_id" ? "insumo_nombre" : "proveedor_razon_social"]: label
            }));
        }
    };

    const handleReset = () => {
        const partes = getPartesFechaHoraActual();
        setFechaInput(partes.fechaDDMMYY);
        setHoraInput(partes.hora);
        setFechaISOPicker(partes.fechaISO);
        setFormData({
            insumo_id: "",
            proveedor_id: "",
            insumo_nombre: "",
            proveedor_razon_social: "",
            precio_unitario: "",
            fecha_desde: partes.isoCompleto,
            fecha_vencimiento: "",
            cantidad: 1,
            precio_total: 0
        });
        setUdmInsumoActual("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const precioUnitarioNum = parseFloat(String(formData.precio_unitario).replace(",", "."));
        const cantidadNum = parseFloat(String(formData.cantidad).replace(",", "."));

        if (!formData.insumo_id || !formData.proveedor_id) {
            notify.warning("Debe seleccionar un insumo y un proveedor");
            return;
        }
        if (!precioUnitarioNum || precioUnitarioNum <= 0) {
            notify.warning("Por favor ingrese un precio unitario válido mayor a 0");
            return;
        }

        // Validar formato de fecha DD/MM/YY
        const partesFecha = fechaInput.split("/");
        if (
            partesFecha.length !== 3 ||
            partesFecha[0].length !== 2 ||
            partesFecha[1].length !== 2 ||
            partesFecha[2].length !== 2
        ) {
            notify.warning("La fecha de compra debe tener formato DD/MM/YY (ej: 18/10/26)");
            return;
        }

        // Sin alterar el cuerpo que se manda al backend:
        onSubmit({
            ...formData,
            precio_unitario: precioUnitarioNum,
            cantidad: cantidadNum > 0 ? cantidadNum : 1
        });
    };

    return (
        <form className="row g-3" onSubmit={handleSubmit}>
            {/* Insumo */}
            <div className="col-md-6">
                <label className="form-label fw-semibold">Insumo</label>
                <Select
                    required
                    name="insumo_id"
                    onChange={handleChange}
                    value={
                        formData.insumo_id
                            ? { value: formData.insumo_id, label: formData.insumo_nombre }
                            : null
                    }
                    options={insumos}
                    placeholder="Seleccionar insumo..."
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                        control: (base, state) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: state.isFocused ? "#2563eb" : "#cbd5e1"
                        })
                    }}
                />
            </div>

            {/* Proveedor */}
            <div className="col-md-6">
                <label className="form-label fw-semibold">Proveedor</label>
                <Select
                    required
                    name="proveedor_id"
                    onChange={handleChange}
                    value={
                        formData.proveedor_id
                            ? { value: formData.proveedor_id, label: formData.proveedor_razon_social }
                            : null
                    }
                    options={proveedores}
                    placeholder="Seleccionar proveedor..."
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                        control: (base, state) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: state.isFocused ? "#2563eb" : "#cbd5e1"
                        })
                    }}
                />
            </div>

            {/* Precio Unitario */}
            <div className="col-md-4">
                <label className="form-label fw-semibold">
                    Precio unitario{" "}
                    {udmInsumoActual && `(${udmInsumoActual.nombre} / ${udmInsumoActual.simbolo})`}
                </label>
                <input
                    name="precio_unitario"
                    onChange={handleChange}
                    value={formData.precio_unitario}
                    type="text"
                    placeholder="Ej: 1500.50"
                    className="form-control"
                    required
                />
            </div>

            {/* Fecha de Compra en formato DD/MM/YY + Hora */}
            <div className="col-md-4">
                <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
                    <span>Fecha de Compra</span>
                    <span className="badge bg-light text-muted border font-monospace" style={{ fontSize: "0.72rem" }}>
                        DD/MM/YY
                    </span>
                </label>
                <div className="input-group">
                    {/* Campo de fecha visible DD/MM/YY */}
                    <input
                        type="text"
                        className="form-control text-center font-monospace"
                        placeholder="DD/MM/YY"
                        value={fechaInput}
                        onChange={handleFechaInputChange}
                        title="Fecha en formato DD/MM/YY (ej: 18/10/26)"
                        maxLength={8}
                        required
                    />

                    {/* Botón de calendario con DatePicker nativo */}
                    <div className="position-relative d-flex align-items-center">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-2 d-flex align-items-center h-100"
                            tabIndex={-1}
                            title="Abrir calendario"
                        >
                            <FaCalendarAlt size={14} />
                        </button>
                        <input
                            type="date"
                            value={fechaISOPicker}
                            onChange={handlePickerDateChange}
                            className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                            style={{ cursor: "pointer" }}
                            tabIndex={-1}
                        />
                    </div>

                    {/* Campo de hora nativo */}
                    <input
                        type="time"
                        className="form-control text-center font-monospace"
                        value={horaInput}
                        onChange={handleHoraInputChange}
                        title="Hora de compra"
                        required
                    />
                </div>
            </div>

            {/* Vencimiento */}
            <div className="col-md-4">
                <label className="form-label fw-semibold">Vencimiento (Opcional)</label>
                <input
                    name="fecha_vencimiento"
                    onChange={handleChange}
                    value={formData.fecha_vencimiento}
                    type="date"
                    className="form-control"
                />
            </div>

            {/* Cantidad */}
            <div className="col-md-6">
                <label className="form-label fw-semibold">Cantidad</label>
                <input
                    name="cantidad"
                    onChange={handleChange}
                    value={formData.cantidad}
                    type="number"
                    step="any"
                    min="0.01"
                    className="form-control"
                    required
                />
            </div>

            {/* Precio Total Formateado en $ con punto para miles y coma para decimales */}
            <div className="col-md-6">
                <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
                    <span>Precio Total (Calculado)</span>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-0 small">
                        Automático
                    </span>
                </label>
                <input
                    name="precio_total"
                    value={formatearMoneda(formData.precio_total)}
                    type="text"
                    readOnly
                    className="form-control bg-light fw-bold text-primary font-monospace"
                    style={{ fontSize: "1.1rem" }}
                />
            </div>

            {/* Botones de acción */}
            <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-4"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting && (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    )}
                    {submitting ? "Guardando compra..." : "Guardar Compra"}
                </button>
                <button
                    className="btn btn-outline-secondary px-3"
                    type="button"
                    onClick={handleReset}
                    disabled={submitting}
                >
                    Limpiar
                </button>
            </div>
        </form>
    );
};

export default FormCompra;