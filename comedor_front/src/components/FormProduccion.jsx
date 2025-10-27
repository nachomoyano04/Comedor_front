import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";

const FormProduccion = ({recetas, onSubmit}) => {
    const [formData, setFormData] = useState({receta_id: "", cantidad_producida: "", turno: "", cantidad_comensales: "", insumos: []});
    const [insumos, setInsumos] = useState([]); 
    const [insumosBase, setInsumosBase] = useState([]);
    const [cantidadInsumoEditable, setCantidadInsumoEditable] = useState(false);
    const [receta, setReceta] = useState(null);
    const [turno, setTurno] = useState(null);
    const opcionesTurno = [{value: "mañana", label: "Mañana"}, {value: "tarde", label: "Tarde"}, {value: "noche", label: "Noche"}];
    const isEditing = false; // Por el momento hasta que hagamos la logica de editar la produccion...
    
    const handleSubmit = e => {
        e.preventDefault(); 
        onSubmit({...formData, receta_id: receta.value, turno: turno.value, insumos});
    }

    const handleSelectReceta = e => {
        setReceta(e);
        setInsumos(e?.insumos || []);
        setInsumosBase(e?.insumos || []);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        if(name == "cantidad_producida" || name == "cantidad_comensales"){
            setFormData({...formData, [name]:value});
            if(name == "cantidad_producida" && insumos.length > 0 && receta){ //acá hacemos el producto entre la cantidad de produccion y la cantidad en cada insumo
                if(value && parseFloat(value) > 0){
                    setCantidadInsumoEditable(true);
                    const cantidadReceta = parseFloat(value);
                    setInsumos(insumosBase.map(insumo => ({...insumo, cantidad: (parseFloat(insumo.cantidad) * cantidadReceta).toFixed(2)})));
                }else{
                    setCantidadInsumoEditable(false); //desactivamos la cantidad en insumos
                    setInsumos(insumosBase); //volvemos a los insumos originales
                }
            }
        }
        if(name == "insumo"){
            const insumo_id = e.target.getAttribute("data-id");
            setInsumos(insumos.map(i => i.value == insumo_id? {...i, cantidad: value}:i));
        }
    }

    const handleReset = () => {
        setFormData({receta_id: "", cantidad_producida: "", turno: "", cantidad_comensales: ""});
        setTurno(null);
        setReceta(null);
        setInsumos([]);
        setInsumosBase([]);
        setCantidadInsumoEditable(false);
    }

    const handleSelectTurno = e => setTurno(e)

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
                    {insumos.map((l) => (
                        <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                            <div className="d-flex align-items-center flex-grow-1">
                                <span className="fw-medium">{l.label}</span>
                            </div>
                            <div className="d-flex align-items-center ms-3 input-cantidad-insumo">
                                <input disabled={!cantidadInsumoEditable} type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad ("+l.simbolo+")"} required/>
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
                <input name="cantidad_producida" autoComplete="off" onChange={handleChange} type="number" min={"0"} className="form-control" value={formData.cantidad_producida} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Turno</label>
                <Select isClearable name="turno" options={opcionesTurno} value={turno} onChange={handleSelectTurno} required/>
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