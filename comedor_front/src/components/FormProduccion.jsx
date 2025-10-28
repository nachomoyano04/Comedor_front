import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";

const FormProduccion = ({recetas, produccion = null, onSubmit}) => {
    const isEditing = produccion != null;
    const [formData, setFormData] = useState({receta_id: "", cantidad_producida: "", turno: "", cantidad_comensales: produccion?.cantidad_comensales || "", insumos: []});
    const [receta, setReceta] = useState(isEditing?recetas.find(r => r.value == produccion.receta_id):null);
    const [cantidadReceta, setCantidadReceta] = useState(produccion?.cantidad_producida || 1);
    const [insumos, setInsumos] = useState(isEditing?produccion?.insumos:[]); 
    const [insumosBase, setInsumosBase] = useState(isEditing?produccion?.insumos:[]);
    const opcionesTurno = [{value: "mañana", label: "Mañana"}, {value: "tarde", label: "Tarde"}, {value: "noche", label: "Noche"}];
    const [turno, setTurno] = useState(isEditing?opcionesTurno.find(ot => ot.value == produccion.turno) : null);
    const [fecha, setFecha] = useState(isEditing? new Date(produccion?.fecha).toISOString().slice(0,16) : null);

    const handleSubmit = e => {
        e.preventDefault(); 
        if(isEditing){ //Si esta editando mandamos la fecha y tambien si hubieron cambios en los insumos
            onSubmit({...formData, fecha, receta_id: receta.value, turno: turno.value, cantidad_producida: cantidadReceta, insumos});
        }else{
            onSubmit({...formData, receta_id: receta.value, turno: turno.value, cantidad_producida: cantidadReceta, insumos});
        }
    }

    const handleSelectReceta = e => {
        setCantidadReceta(1)
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
                    setCantidadReceta(value);
                    const cantidadReceta = parseFloat(value);
                    setInsumos(insumosBase.map(insumo => ({...insumo, cantidad: (parseFloat(insumo.cantidad) * cantidadReceta).toFixed(2)})));
                }else{
                    setInsumos(insumosBase); //volvemos a los insumos originales
                }
            }
        }
        if(name == "insumo"){
            const insumo_id = e.target.getAttribute("data-id");
            setInsumos(insumos.map(i => i.value == insumo_id? {...i, cantidad: value}:i));
        }
        if(name == "fecha"){
            setFecha(value);
        }
    }

    const handleReset = () => {
        setFormData({receta_id: "", cantidad_producida: "", turno: "", cantidad_comensales: ""});
        setTurno(null);
        setReceta(null);
        setInsumos([]);
        setInsumosBase([]);
    }

    const areChanges = () => {

    }

    const handleClickBtnListaInsumos = i => setInsumos(insumos.filter(ins => ins.value != i.value));

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
                            <div className="d-flex align-items-center gap-2 ms-3">
                                {cantidadReceta && (<small className="text-muted">x{cantidadReceta}</small>)}
                                <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad ("+l.simbolo+")"} required/>
                                <small className="text-muted">{l.simbolo}</small>
                            </div>
                            {isEditing && (<button type="button" className="btn btn-sm ms-3 p-1" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon icon={faTrash} className="text-danger" style={{color: "#ff0000",}}/></button>)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad de receta</label>
                <input name="cantidad_producida" autoComplete="off" onChange={handleChange} type="number" min={"0"} className="form-control" value={cantidadReceta} required />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Turno</label>
                <Select isClearable name="turno" options={opcionesTurno} value={turno} onChange={handleSelectTurno} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Cantidad comensales</label>
                <input name="cantidad_comensales" autoComplete="off" onChange={handleChange} type="number" min={"1"} className="form-control" value={formData.cantidad_comensales} required />
            </div>
            {produccion && (
                <div className="col-md-4 mb-3">
                    <label className="form-label">Fecha</label>
                    <input name="fecha" onChange={handleChange} type="datetime-local" className="form-control" value={fecha} required />
                </div>
            )}
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={!isEditing ? false : isEditing && areChanges ? false : true}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
            <input className="btn btn-secondary" type="button" disabled={!isEditing ? false : isEditing && areChanges ? false : true} onClick={handleReset} value={"Cancelar"} />
        </div>
    </form>
}

export default FormProduccion;