import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";

const FormProduccion = ({ recetas, produccion = null, onSubmit }) => {
    const isEditing = produccion != null;
    const horaActual = new Date().toLocaleString('sv', { hour12: false }).slice(0,16);
    const [formData, setFormData] = useState({
        cantidad_comensales: isEditing? produccion.cantidad_comensales : "",
        cantidad_producida: isEditing? produccion.cantidad_producida : "",
        receta_id: isEditing? produccion.receta_id : "",
        turno: isEditing? produccion.turno : "",
        insumos: isEditing? produccion.insumos.map(i => ({...i, cantidad: Number(i.cantidad)})) : [],
        fecha: isEditing? new Date(produccion.fecha).toISOString().slice(0, 16) : horaActual
    });
    const [receta, setReceta] = useState(isEditing ? recetas.find(r => r.value == produccion.receta_id) : null);
    const opcionesTurno = [{ value: "mañana", label: "Mañana" }, { value: "tarde", label: "Tarde" }, { value: "noche", label: "Noche" }];
    const [turno, setTurno] = useState(isEditing ? opcionesTurno.find(ot => ot.value == produccion.turno) : null);
    const [areChanges, setAreChanges] = useState(false);

    let restProduccion;
    if(produccion){
        let { id, costo_primo_total, descripcion, estado, nombre, fecha, insumos, ...rest } = produccion;
        restProduccion = { ...rest, fecha: new Date(fecha).toISOString().slice(0, 16), insumos: insumos.map(i => ({ ...i, cantidad: Number(i.cantidad) })) }
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (isEditing) { //Si esta editando mandamos la fecha y tambien si hubieron cambios en los insumos
            onSubmit(formData);
        } else {
            const {fecha, ...restFormData} = formData;
            onSubmit(restFormData);
        }
    }

    const handleSelectReceta = e => {
        setReceta(e);
        if(!e) return;
        const recetaDiferente = !produccion || produccion.receta_id != e.value 
        let formActualizado;
        if(recetaDiferente){
            formActualizado = {...formData, cantidad_producida: "", insumos: e.insumos, cantidad_comensales: "", turno: "", receta_id: e.value, fecha: horaActual};
        }else{
            formActualizado = {...formData, cantidad_producida: restProduccion.cantidad_producida, insumos: restProduccion.insumos, cantidad_comensales: restProduccion.cantidad_comensales, fecha: restProduccion.fecha};
        }
        isEditing && setAreChanges(!isEqual(restProduccion, formActualizado));
        setFormData(formActualizado);
    }

    const cambiarCantInsumos = (insumos, cantidad) => {
        const cantidadOriginalInsumo = parseFloat(isEditing ? restProduccion.cantidad_producida : 1);
        return insumos.map(i => {
            const cantidadBase = parseFloat(i.cantidad) / cantidadOriginalInsumo;
            return {...i, cantidad: Number((cantidadBase * cantidad).toFixed(2))};
        });
    }

    const handleChange = e => {
        const { name, value } = e.target;
        if (name == "cantidad_producida" && formData.insumos.length > 0 && receta && value < 1001 && value.length < 5) {
            let newFormData;
            if (value && parseFloat(value) > 0) { //acá hacemos el producto entre la cantidad de produccion y la cantidad en cada insumo
                const cantidad = parseFloat(value);
                const insumosConCantidad = isEditing? cambiarCantInsumos(restProduccion.insumos, cantidad) : cambiarCantInsumos(receta.insumos, cantidad);
                newFormData = {...formData, cantidad_producida: Number(value.replace(/[^0-9]/g, '')), insumos: insumosConCantidad};
            } else {
                newFormData = {...formData, cantidad_producida: Number(value.replace(/[^0-9]/g, '')), insumos: isEditing? restProduccion.insumos: receta.insumos};
            }
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && value > 0);
            setFormData(newFormData)
        }
        if(name == "cantidad_comensales" && value <= 10000 && value.length < 6){
            const newFormData = {...formData, cantidad_comensales: Number(value.replace(/[^0-9]/g, ''))}
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && value > 0);
            setFormData(newFormData)
        }
        if (name == "insumo") {
            const insumo_id = e.target.getAttribute("data-id");
            const newFormData = {...formData, insumos: formData.insumos.map(i => i.value == insumo_id? {...i, cantidad: Number(value)}:i)}
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
            setFormData(newFormData);
        }
        if (name == "fecha") {
            const newFormData = {...formData, fecha: value};
            isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
            setFormData(newFormData);
        }
    }

    const handleReset = () => {
        setFormData({
            cantidad_comensales: produccion?.cantidad_comensales || "",
            cantidad_producida: produccion?.cantidad_producida || "",
            receta_id: produccion?.receta_id || "",
            turno: produccion?.turno || "",
            insumos: produccion?.insumos.map(i => ({...i, cantidad: Number(i.cantidad)})) || [],
            fecha: new Date(produccion?.fecha).toISOString().slice(0, 16) || horaActual
        });
        setTurno(isEditing ? opcionesTurno.find(ot => ot.value == produccion.turno) : null);
        setReceta(isEditing ? recetas.find(r => r.value == produccion.receta_id) : null);
        isEditing && setAreChanges(false);
    }

    const handleClickBtnListaInsumos = i => {
        const newFormData = {...formData, insumos: formData.insumos.filter(ins => ins.value != i.value)};
        isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
        setFormData(newFormData);
    }

    const handleSelectTurno = e => {
        setTurno(e);
        if(!e) return;
        const newFormData = {...formData, turno: e.value};
        isEditing && setAreChanges(!isEqual(newFormData, restProduccion) && newFormData.cantidad_comensales > 0 && newFormData.cantidad_producida > 0);
        setFormData(newFormData);
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Receta</label>
                <Select isClearable name="receta_id" value={receta} options={recetas} onChange={handleSelectReceta} required/>
            </div>
            <div className="col-md-8 mb-3">
                <div className="d-flex justify-content-between">
                    <label className="form-label fw-semibold">Lista de insumos</label>
                    {receta && (
                        <NavLink to={`/recetas/editar/${receta.value}`} className="btn btn-sm btn-outline-secondary mb-1 d-flex align-items-center gap-2" title="Para agregar o eliminar insumos debe editar la receta">
                            <FontAwesomeIcon icon={faCircleInfo} />
                            <span>Editar receta</span>
                        </NavLink>
                    )}
                </div>
                <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                    {formData.insumos.map((l) => (
                        <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                            <div className="d-flex align-items-center flex-grow-1">
                                <span className="fw-medium">{l.label}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 ms-3">
                                {formData.cantidad_producida > 0 && (<small className="text-muted">x{formData.cantidad_producida}</small>)}
                                <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad (" + l.simbolo + ")"} required />
                                <small className="text-muted">{l.simbolo}</small>
                            </div>
                            {isEditing && (<button type="button" className="btn btn-sm ms-3 p-1" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon icon={faTrash} className="text-danger" style={{ color: "#ff0000", }} /></button>)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad de receta</label>
                <input name="cantidad_producida" autoComplete="off" onChange={handleChange} type="text" inputMode="numeric" pattern="[0-9]*" min={"1"} className={`form-control ${formData.cantidad_producida <= 0? `border border-danger`: ``}`} value={formData.cantidad_producida} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Turno</label>
                <Select isClearable name="turno" options={opcionesTurno} value={turno} onChange={handleSelectTurno} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad comensales</label>
                <input name="cantidad_comensales" autoComplete="off" onChange={handleChange} type="text" inputMode="numeric" pattern="[0-9]*" min={"1"} className={`form-control ${formData.cantidad_comensales <= 0? `border border-danger`: ``}`} value={formData.cantidad_comensales} required />
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
    </form>
}

export default FormProduccion;