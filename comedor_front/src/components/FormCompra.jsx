import { useState, useEffect } from "react";
import Select from "react-select";
import notify from "../utils/notify";

// Helper para obtener fecha y hora actual en formato local YYYY-MM-DDTHH:mm
const getFechaHoraActual = () => {
    const ahora = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = ahora.getFullYear();
    const mm = pad(ahora.getMonth() + 1);
    const dd = pad(ahora.getDate());
    const hh = pad(ahora.getHours());
    const min = pad(ahora.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const FormCompra = ({
    onSubmit,
    udm = [],
    insumos = [],
    proveedores = [],
    submitting = false,
    prefillData = null
}) => {
    const [formData, setFormData] = useState({
        insumo_id: "",
        proveedor_id: "",
        insumo_nombre: "",
        proveedor_razon_social: "",
        precio_unitario: "",
        fecha_desde: getFechaHoraActual(),
        fecha_vencimiento: "",
        cantidad: 1,
        precio_total: 0
    });
    const [udmInsumoActual, setUdmInsumoActual] = useState("");

    // Efecto de inicialización y pre-relleno automático
    useEffect(() => {
        if (!prefillData) {
            setFormData((prev) => ({
                ...prev,
                fecha_desde: prev.fecha_desde || getFechaHoraActual()
            }));
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

        setFormData((prev) => ({
            ...prev,
            insumo_id: insumoId,
            insumo_nombre: insumoNombre,
            proveedor_id: proveedorId,
            proveedor_razon_social: proveedorNombre,
            cantidad: cantidad,
            precio_unitario: precioUnit > 0 ? precioUnit : "",
            precio_total: precioTotal > 0 ? precioTotal : 0,
            fecha_desde: prev.fecha_desde || getFechaHoraActual()
        }));

        if (insumoObj?.id_udm) {
            setUdmInsumoActual(udm.find((u) => u.id == insumoObj.id_udm) || "");
        }
    }, [prefillData, insumos, proveedores, udm]);

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
        setFormData({
            insumo_id: "",
            proveedor_id: "",
            insumo_nombre: "",
            proveedor_razon_social: "",
            precio_unitario: "",
            fecha_desde: getFechaHoraActual(),
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
        onSubmit({
            ...formData,
            precio_unitario: precioUnitarioNum,
            cantidad: cantidadNum > 0 ? cantidadNum : 1
        });
    };

    return (
        <form className="row g-3" onSubmit={handleSubmit}>
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
            <div className="col-md-4">
                <label className="form-label fw-semibold">Fecha de Compra</label>
                <input
                    name="fecha_desde"
                    onChange={handleChange}
                    value={formData.fecha_desde}
                    type="datetime-local"
                    className="form-control"
                    required
                />
            </div>
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
            <div className="col-md-6">
                <label className="form-label fw-semibold">Precio Total (Calculado)</label>
                <input
                    name="precio_total"
                    value={formData.precio_total}
                    type="text"
                    readOnly
                    className="form-control bg-light fw-bold text-primary"
                />
            </div>
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