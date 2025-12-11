import { useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { isEqualWith } from "lodash";
import { trimer } from "../services/globalFunctions";

const FormReceta = ({ receta, ins, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: receta?.nombre || "", cuantos_comen: receta?.cuantos_comen || 1, descripcion: receta?.descripcion || "", insumo: receta?.insumo || []
    })
    const [insumos, setInsumos] = useState(ins);
    const [areChanges, setAreChanges] = useState(false);
    const isEditing = receta != null;

    const handleSubmit = e => {
        e.preventDefault();
        const insumosBien = formData.insumo.every(i => i.cantidad > 0);
        onSubmit(insumosBien ? formData : { error: "Las cantidades de los insumos deben ser mayores a 0" });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData;
        if (name == "insumo") { // Para manejar los insumos con sus respectivas cantidades
            const insumo_id = e.target.getAttribute("data-id")
            newFormData = { ...formData, insumo: formData.insumo.map(i => i.value == insumo_id ? { ...i, cantidad: Number(value) } : i).sort((a, b) => a.value - b.value) };
            setFormData(newFormData)
        } else { // Para manejar el nombre y la descripcion...
            newFormData = { ...formData, [name]: name == "cuantos_comen" ? Number(value) : value };
        }
        isEditing && setAreChanges(!isEqualWith(newFormData, receta, trimer));
        setFormData(newFormData);
    }

    const handleSelect = (insumoSeleccionado) => { //sacar el insumo de los insumos y agregarlo a listaInsumos...
        const nuevo = { ...insumoSeleccionado, cantidad: 0 };
        const newFormData = { ...formData, insumo: [...formData.insumo, nuevo] };
        setFormData(newFormData)
        setInsumos(prev => prev.filter(i => i.value != insumoSeleccionado.value));
    }

    const handleClickBtnListaInsumos = e => { //agregamos el insumo a los insumos y lo sacamos de la listaInsumos
        const newFormData = { ...formData, insumo: formData.insumo.filter(i => i.value != e.value) };
        isEditing && setAreChanges(!isEqualWith(newFormData, receta, trimer));
        setFormData(newFormData);
        setInsumos(prev => [...prev, e]);
    }

    const handleReset = () => {
        setFormData({ nombre: receta?.nombre || "", cuantos_comen: receta?.cuantos_comen || 1, descripcion: receta?.descripcion || "", insumo: receta?.insumo || [] });
        setInsumos(ins);
        isEditing && setAreChanges(false);
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="col-md-7 mb-3">
            <label className="form-label">Nombre</label>
            <input name="nombre" autoComplete="off" onChange={handleChange} type="text" className="form-control" value={formData.nombre} required />
        </div>
        <div className="col-md-2 mb-3"></div>
        <div className="col-md-3 mb-3">
            <label className="form-label">Cuantos comen</label>
            <input name="cuantos_comen" autoComplete="off" onChange={handleChange} type="number" className="form-control" value={formData.cuantos_comen} required />
        </div>
        <div className="col-md-7 mb-3">
            <label className="form-label">Descripción</label>
            <input name="descripcion" autoComplete="off" onChange={handleChange} type="text" className="form-control" value={formData.descripcion} required />
        </div>
        <div className="col-md-3 mb-3"></div>
        <div className="col-md-4 mb-3">
            <label className="form-label">Insumos</label>
            <Select name="insumos" options={insumos} onChange={handleSelect} />
        </div>
        <div className="col-md-8 mb-3">
            <label className="form-label fw-semibold">Lista de insumos</label>
            <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                {formData.insumo.map((l) => (
                    <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                        <div className="d-flex align-items-center flex-grow-1">
                            <span className="fw-medium">{l.label}</span>
                        </div>
                        <div className="d-flex align-items-center ms-3">
                            <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad (" + l.simbolo + ")"} required />
                            <small className="ms-2 text-muted">{l.simbolo}</small>
                        </div>
                        <button type="button" className="btn btn-sm ms-3 p-1" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon icon={faTrash} className="text-danger" style={{ color: "#ff0000", }} /></button>
                    </li>
                ))}
            </ul>
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={isEditing && !areChanges}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
            <input className="btn btn-secondary" type="button" disabled={isEditing && !areChanges} onClick={handleReset} value={"Cancelar"} />
        </div>
        {isEditing && !areChanges && (
            <div className="text-end">
                <small style={{ color: "#555555", fontStyle: "italic" }}>No hay cambios aún</small>
            </div>
        )}
    </form>
}

export default FormReceta;