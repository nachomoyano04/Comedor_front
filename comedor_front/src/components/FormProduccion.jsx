import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEqual } from "lodash";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";

const FormProduccion = ({recetas, produccion = null, onSubmit}) => {
    const isEditing = produccion != null;
    const [formData, setFormData] = useState({ cantidad_comensales: produccion?.cantidad_comensales || "",  cantidad_producida: produccion?.cantidad_producida || "", fecha: produccion?.fecha || null, receta_id: produccion?.receta_id || "", turno: produccion?.turno || "", insumos: produccion?.insumos || []});
    const [receta, setReceta] = useState(isEditing?recetas.find(r => r.value == produccion.receta_id):null);
    const [cantidadReceta, setCantidadReceta] = useState(isEditing?produccion?.cantidad_producida : "");
    const [insumos, setInsumos] = useState(isEditing?produccion?.insumos:[]); 
    const [insumosBase, setInsumosBase] = useState(isEditing?produccion?.insumos:[]);
    const opcionesTurno = [{value: "mañana", label: "Mañana"}, {value: "tarde", label: "Tarde"}, {value: "noche", label: "Noche"}];
    const [turno, setTurno] = useState(isEditing?opcionesTurno.find(ot => ot.value == produccion.turno) : null);
    const [fecha, setFecha] = useState(isEditing? new Date(produccion?.fecha).toISOString().slice(0,16) : null);
    const [areChanges, setAreChanges] = useState(false);
    const {id, costo_primo_total, descripcion, estado, nombre, ...restProduccion} = produccion;

    const handleSubmit = e => {
        e.preventDefault(); 
        if(isEditing){ //Si esta editando mandamos la fecha y tambien si hubieron cambios en los insumos
            onSubmit({...formData, fecha, receta_id: receta.value, turno: turno.value, cantidad_producida: cantidadReceta, insumos});
        }else{
            const sinFechaFormData = {fecha, ...formData};
            onSubmit({...formData, receta_id: receta.value, turno: turno.value, cantidad_producida: cantidadReceta, insumos});
        }
    }

    const handleSelectReceta = e => {
        setCantidadReceta(isEditing?produccion?.cantidad_producida : "")
        setReceta(e);
        setInsumos(e?.insumos || []);
        setInsumosBase(e?.insumos || []);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        if((name == "cantidad_producida" || name == "cantidad_comensales")){
            setFormData(prev => {
                const actualizado = {...prev, [name]: Number(value.replace(/[^0-9]/g, ''))};
                setAreChanges(!isEqual(restProduccion, actualizado));
                return actualizado;
            });
            if(name == "cantidad_producida" && insumos.length > 0 && receta && value < 1001 && value.length < 5){ 
                setAreChanges(value != produccion?.cantidad_producida);
                setCantidadReceta(value);
                if(value && parseFloat(value) > 0){ //acá hacemos el producto entre la cantidad de produccion y la cantidad en cada insumo
                    const cantidad = parseFloat(value);
                    setInsumos(insumosBase.map(insumo => ({...insumo, cantidad: (parseFloat(insumo.cantidad) * cantidad).toFixed(2)})));
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
            value && setFormData(prev => {
                const updated = {...prev, ["fecha"]: new Date(value).toISOString()}; //Corregir que le agrega 3 horas más...
                console.log(updated);
                console.log(restProduccion);
                setAreChanges(!isEqual(updated, restProduccion));
                return prev;
            })
        }
    }

    const handleReset = () => {
        setFormData({receta_id: "", cantidad_producida: "", turno: "", cantidad_comensales: produccion?.cantidad_comensales || "", insumos: []});
        setTurno(isEditing?opcionesTurno.find(ot => ot.value == produccion.turno) : null);
        setCantidadReceta(produccion?.cantidad_producida || "")
        setReceta(isEditing?recetas.find(r => r.value == produccion.receta_id):null);
        setInsumos(isEditing?produccion?.insumos:[]);
        setInsumosBase(isEditing?produccion?.insumos:[]);
        setFecha(isEditing? new Date(produccion?.fecha).toISOString().slice(0,16) : null);
        setAreChanges(false);
    }

    const handleClickBtnListaInsumos = i => setInsumos(insumos.filter(ins => ins.value != i.value));

    const handleSelectTurno = e => {
        setTurno(e);
        e && setFormData(prev => {
                const updated = {...prev, ["turno"]: e.value};
                setAreChanges(!isEqual(updated, restProduccion))
                return updated;
            })
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
                <input name="cantidad_producida" autoComplete="off" onChange={handleChange} type="text" inputMode="numeric" pattern="[0-9]*" min={"1"} className="form-control" value={cantidadReceta} required />
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