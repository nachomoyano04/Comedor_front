import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Select from "react-select";

const FormProduccion = ({recetas, onSubmit}) => {
    const [formData, setFormData] = useState({receta_id: "", cantidad: "", turno: "", cantidad_comensales: ""});
    const [insumos, setInsumos] = useState([]); 
    const [insumosBase, setInsumosBase] = useState([]);
    const [receta, setReceta] = useState(null);
    const turnos = [{value: "mañana", label: "Mañana"}, {value: "tarde", label: "Tarde"}, {value: "noche", label: "Noche"}];
    const handleSubmit = e => {
        e.preventDefault(); onSubmit(formData);
    }
    const isEditing = false; // Por el momento hasta que hagamos la logica de editar la produccion...
    const handleSelectReceta = (e) => {
        setInsumos(e.insumos);
        setInsumosBase(e.insumos);
        setReceta(e.value);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        setFormData({...formData, [name]:value});
        if(name == "cantidad" && insumos.length > 0 && receta){ //acá hacemos el producto entre la cantidad de produccion y la cantidad en cada insumo
            if(value && parseFloat(value) > 0){
                const cantidadReceta = parseFloat(value);
                setInsumos(insumosBase.map(insumo => ({...insumo, cantidad: (parseFloat(insumo.cantidad) * cantidadReceta).toFixed(2)})));
            }else{
                setInsumos(insumosBase);
            }
        }
    }

    const handleReset = () => {

    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Receta</label>
                <Select name="receta_id" options={recetas} onChange={handleSelectReceta} required/>
            </div>
            <div className="col-md-8 mb-3">
                <label className="form-label fw-semibold">Lista de insumos</label>
                <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                    {insumos.map((l) => (
                        <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                            <div className="d-flex align-items-center flex-grow-1">
                                <span className="fw-medium">{l.label}</span>
                            </div>
                            <div className="d-flex align-items-center ms-3">
                                <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad ("+l.simbolo+")"} required/>
                                <small className="ms-2 text-muted">{l.simbolo}</small>
                            </div>
                            <button type="button" className="btn btn-sm ms-3 p-1" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon icon={faTrash} className="text-danger" style={{color: "#ff0000",}}/></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad de receta</label>
                <input name="cantidad" autoComplete="off" onChange={handleChange} type="number" min={"0"} className="form-control" value={formData.cantidad} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Turno</label>
                <Select name="turno" options={turnos} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad comensales</label>
                <input name="cantidad_comensales" autoComplete="off" onChange={handleChange} type="number" min={"1"} className="form-control" value={formData.cantidad_comensales} required />
            </div>
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={!isEditing ? false : isEditing && areChanges ? false : true}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
            <input className="btn btn-secondary" type="button" disabled={!isEditing ? false : isEditing && areChanges ? false : true} onClick={handleReset} value={"Cancelar"} />
        </div>
    </form>
}

export default FormProduccion;