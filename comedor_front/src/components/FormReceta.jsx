import { useEffect, useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faTrash } from "@fortawesome/free-solid-svg-icons";
import { isEqualWith } from "lodash";
import { trimer } from "../services/globalFunctions";

const FormReceta = ({ receta, ins, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: receta?.nombre || "",
        cuantos_comen: receta?.cuantos_comen || 1,
        descripcion: receta?.descripcion || "",
        insumo: receta?.insumo || []
    });
    const [insumos, setInsumos] = useState(ins || []);
    const [selectedOption, setSelectedOption] = useState(null);
    const [ultimoAgregadoId, setUltimoAgregadoId] = useState(null);
    const [areChanges, setAreChanges] = useState(false);
    const isEditing = receta != null;

    // Sincronizar insumos disponibles cuando llegan las props
    useEffect(() => {
        if (ins && ins.length > 0) {
            const seleccionadosIds = new Set((formData.insumo || []).map(i => i.value));
            setInsumos(ins.filter(i => !seleccionadosIds.has(i.value)));
        }
    }, [ins]);

    const handleSubmit = e => {
        e.preventDefault();
        if (formData.insumo.length === 0) {
            return onSubmit({ error: "Debe seleccionar al menos un insumo para la receta" });
        }
        const insumosBien = formData.insumo.every(i => Number(i.cantidad) > 0);
        if (!insumosBien) {
            return onSubmit({ error: "Las cantidades de los insumos deben ser mayores a 0" });
        }
        onSubmit({
            ...formData,
            cuantos_comen: Number(formData.cuantos_comen) || 1,
            insumo: formData.insumo.map(i => ({ ...i, cantidad: Number(i.cantidad) }))
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData;
        if (name === "insumo") {
            const insumo_id = e.target.getAttribute("data-id");
            // Mantiene el orden estricto de Pila (LIFO) sin reordenar alfabéticamente ni por id
            newFormData = {
                ...formData,
                insumo: formData.insumo.map(i => i.value == insumo_id ? { ...i, cantidad: value === "" ? "" : value } : i)
            };
        } else {
            newFormData = { ...formData, [name]: name === "cuantos_comen" ? Number(value) : value };
        }
        isEditing && setAreChanges(!isEqualWith(newFormData, receta, trimer));
        setFormData(newFormData);
    };

    const handleSelect = (insumoSeleccionado) => {
        if (!insumoSeleccionado) return;
        const nuevo = { ...insumoSeleccionado, cantidad: "" };
        // PILA (LIFO): El último que se agrega queda siempre ARRIBA (al inicio del array)
        const newFormData = { ...formData, insumo: [nuevo, ...formData.insumo] };
        setFormData(newFormData);
        isEditing && setAreChanges(!isEqualWith(newFormData, receta, trimer));
        setInsumos(prev => (prev || []).filter(i => i.value !== insumoSeleccionado.value));
        setSelectedOption(null); // Limpia el input del react-select inmediatamente
        setUltimoAgregadoId(insumoSeleccionado.value); // Marca para auto-focus y highlight
    };

    const handleClickBtnListaInsumos = e => {
        const newFormData = { ...formData, insumo: formData.insumo.filter(i => i.value !== e.value) };
        isEditing && setAreChanges(!isEqualWith(newFormData, receta, trimer));
        setFormData(newFormData);
        if (ultimoAgregadoId === e.value) {
            setUltimoAgregadoId(null);
        }
        setInsumos(prev => [...(prev || []), e].sort((a, b) => (a.label || "").localeCompare(b.label || "")));
    };

    const handleReset = () => {
        setFormData({
            nombre: receta?.nombre || "",
            cuantos_comen: receta?.cuantos_comen || 1,
            descripcion: receta?.descripcion || "",
            insumo: receta?.insumo || []
        });
        setInsumos(ins || []);
        setSelectedOption(null);
        setUltimoAgregadoId(null);
        isEditing && setAreChanges(false);
    };

    return (
        <form className="row g-2" onSubmit={handleSubmit}>
            <div className="col-md-7 mb-3">
                <label className="form-label fw-semibold">Nombre de la receta</label>
                <input name="nombre" autoComplete="off" onChange={handleChange} type="text" className="form-control" value={formData.nombre} placeholder="Ej: Guiso de lentejas, Pizza especial..." required />
            </div>
            <div className="col-md-2 mb-3"></div>
            <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Cuantos comen</label>
                <input name="cuantos_comen" autoComplete="off" onChange={handleChange} type="number" min="1" className="form-control" value={formData.cuantos_comen} required />
            </div>

            <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">Descripción o instrucciones</label>
                <input name="descripcion" autoComplete="off" onChange={handleChange} type="text" className="form-control" value={formData.descripcion} placeholder="Detalles de preparación, observaciones o variantes..." required />
            </div>

            <div className="col-12 my-2">
                <hr className="text-secondary opacity-25" />
            </div>

            {/* SECCIÓN INSUMOS */}
            <div className="col-md-5 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold mb-0">Agregar insumo a la receta</label>
                </div>
                <Select
                    name="insumos"
                    value={selectedOption}
                    options={insumos}
                    onChange={handleSelect}
                    placeholder={formData.insumo.length > 0 ? "+ Buscar y agregar otro insumo..." : "Buscar insumo en la despensa..."}
                    noOptionsMessage={() => "No quedan más insumos disponibles"}
                    isClearable={false}
                />
            </div>

            {/* LISTA DE INSUMOS (PILA LIFO) */}
            <div className="col-md-7 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label fw-semibold mb-0 d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
                        <span>Lista de ingredientes</span>
                    </label>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        {formData.insumo.length} {formData.insumo.length === 1 ? "insumo en la pila" : "insumos en la pila"}
                    </span>
                </div>
                <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                    {formData.insumo.length === 0 ? (
                        <li className="list-group-item text-center py-4 bg-light border-dashed">
                            <div className="text-muted py-2">
                                <FontAwesomeIcon icon={faLayerGroup} className="text-secondary opacity-50 fs-2 mb-2" />
                                <p className="mb-1 fw-medium text-dark">Aún no agregaste insumos a la receta</p>
                            </div>
                        </li>
                    ) : (
                        formData.insumo.map((l, index) => (
                            <li
                                key={l.value}
                                className={`list-group-item d-flex justify-content-between align-items-center py-2 px-3 ${index === 0 ? "border-start border-4 border-primary bg-primary bg-opacity-10" : ""
                                    }`}
                            >
                                <div className="d-flex align-items-center flex-grow-1">
                                    <span className="fw-medium">{l.label}</span>
                                </div>
                                <div className="d-flex align-items-center ms-3">
                                    <input
                                        type="number"
                                        step="any"
                                        min="0.001"
                                        name="insumo"
                                        data-id={l.value}
                                        value={l.cantidad === "" ? "" : (l.cantidad ?? "")}
                                        onChange={handleChange}
                                        autoFocus={l.value === ultimoAgregadoId}
                                        className="form-control form-control-sm text-end"
                                        style={{ width: "140px" }}
                                        placeholder={"Cantidad (" + l.simbolo + ")"}
                                        required
                                    />
                                    <small className="ms-2 text-muted fw-semibold" style={{ minWidth: "25px" }}>{l.simbolo}</small>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger ms-2 p-1 px-2 border-0"
                                    title="Quitar de la receta"
                                    onClick={() => handleClickBtnListaInsumos(l)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-primary" type="submit" disabled={isEditing && !areChanges}>
                    {isEditing ? "Guardar cambios" : "Registrar receta"}
                </button>
                <input className="btn btn-secondary" type="button" disabled={isEditing && !areChanges} onClick={handleReset} value={"Cancelar"} />
            </div>
            {isEditing && !areChanges && (
                <div className="text-end">
                    <small style={{ color: "#555555", fontStyle: "italic" }}>No hay cambios aún</small>
                </div>
            )}
        </form>
    );
};

export default FormReceta;