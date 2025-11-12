import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import ModalAddInsumo from "./ProduccionHelpers/ModalAddInsumo";
import { useFormProduccion } from "./ProduccionHelpers/UseFormProduccion";

const FormProduccion = ({ recetas, insumosBD, produccion = null, onSubmit }) => {
    const { receta, handleSelectReceta, isEditing, formData, handleChangeModalInsumo, handleClickModal, insAAgregar, insumosDisponibles, handleChange, opcionesTurno, turno, handleSelectTurno, areChanges, handleReset, handleClickBtnListaInsumos } = useFormProduccion({ produccion, recetas, insumosBD });

    const handleSubmit = e => {
        e.preventDefault();
        if (isEditing) {
            onSubmit(formData);
        } else { //Si esta registrando no mandamos la fecha
            const { fecha, ...restFormData } = formData;
            onSubmit(restFormData);
        }
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Receta</label>
                {isEditing ?
                    (<input name="receta_id" type="text" className={`form-control`} value={receta.label} readOnly />)
                    : (<Select isClearable name="receta_id" value={receta} options={recetas} onChange={handleSelectReceta} required />
                )}
            </div>
            <div className="col-md-8 mb-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2">
                    <label className="form-label fw-semibold mb-2 mb-md-0">Lista de insumos</label>
                    {receta && (
                        <div className="d-flex flex-wrap gap-2">
                            {!isEditing && (
                                <NavLink to={`/recetas/editar/${receta.value}`} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" title="Editar la receta">
                                    <FontAwesomeIcon icon={faCircleInfo} />
                                    <span>Editar receta</span>
                                </NavLink>
                            )}
                            <ModalAddInsumo cantidad_producida={formData.cantidad_producida} handleChangeModalInsumo={handleChangeModalInsumo} handleClickModal={handleClickModal} insAAgregar={insAAgregar} insumosBD={insumosDisponibles} />
                        </div>
                    )}
                </div>
                <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                    {formData.insumos.map((l) => (
                        <li key={l.value} className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center py-2 px-3">
                            <div className="fw-medium flex-grow-1">{l.label}</div>
                            <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-sm-0">
                                {formData.cantidad_producida > 0 && (<small className="text-muted">x{formData.cantidad_producida}</small>)}
                                <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "120px", minWidth: "100px" }} placeholder={"cantidad (" + l.simbolo + ")"} required />
                                <small className="text-muted">{l.simbolo}</small>
                            </div>
                            {isEditing && (<button type="button" className="btn btn-sm p-1 ms-1" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon icon={faTrash} className="text-danger" style={{ color: "#ff0000", }} /></button>)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad de {receta ? `"${receta.label}"` : "---"}</label>
                <input name="cantidad_producida" autoComplete="off" onChange={handleChange} type="text" inputMode="numeric" pattern="[0-9]*" min={"0"} className={`form-control ${formData.cantidad_producida <= 0 && receta ? `border border-danger` : ``}`} value={formData.cantidad_producida || ""} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Turno</label>
                <Select isClearable name="turno" options={opcionesTurno} value={turno} onChange={handleSelectTurno} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad comensales</label>
                <input name="cantidad_comensales" autoComplete="off" onChange={handleChange} type="text" inputMode="numeric" pattern="[0-9]*" min={"1"} className={`form-control ${formData.cantidad_comensales <= 0 && receta ? `border border-danger` : ``}`} value={formData.cantidad_comensales} required />
            </div>
            {produccion && (
                <div className="col-md-4 mb-3">
                    <label className="form-label">Fecha</label>
                    <input name="fecha" onChange={handleChange} type="datetime-local" className="form-control" value={formData.fecha} required />
                </div>
            )}
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={isEditing && !areChanges}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
            <input className="btn btn-secondary" type="button" disabled={isEditing && !areChanges} onClick={handleReset} value={"Cancelar"} />
        </div>
        {isEditing && !areChanges && (<div className="text-end"><small className="text-muted fst-italic">No hay cambios aún</small></div>)}
    </form>
}

export default FormProduccion;