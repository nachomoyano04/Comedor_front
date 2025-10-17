import { useState } from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {isEqual} from "lodash";

const FormReceta = ({ re, ins, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: re?.nombre || "", descripcion: re?.descripcion || "", insumo: []
    })
    const [listaInsumos, setListaInsumos] = useState(re?.insumo || []);
    const [insumos, setInsumos] = useState(ins);
    const [areChanges, setAreChanges] = useState(false);

    const isEditing = re != null;

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({...formData, insumo: listaInsumos});
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(name == "insumo"){ // Para manejar los insumos con sus respectivas cantidades
            const id = e.target.getAttribute("data-id")
            setListaInsumos(prev => prev.map(i => i.value == id? {...i, cantidad: value} : i));
            if(isEditing){//Esta editando y cambia alguna cantidad en el insumo, habilitamos buttons
                const listaInsumosUpdated = listaInsumos.map(li => li.value == id? {...li, cantidad: Number(value)} : {...li, cantidad: Number(li.cantidad)});
                const insumoRecetaOriginalUpdated = re?.insumo.map(i => ({...i, cantidad: Number(i.cantidad)}));
                setAreChanges(!isEqual(listaInsumosUpdated, insumoRecetaOriginalUpdated));
            }
        }else{ // Para manejar el nombre y la descripcion...
            setFormData({...formData, [name]: value});
        }
        if(isEditing && name != "insumo"){//Esta editando y cambia el nombre o descripcion habilitamos buttons
            const hayCambios = name == "nombre"? re.nombre != value : re.descripcion != value;
            setAreChanges(hayCambios);
        }
    }

    const handleSelect = (insumoSeleccionado) => { //sacar el insumo de los insumos y agregarlo a listaInsumos...
        const { value } = insumoSeleccionado;
        setInsumos(insumos.filter(i => i.value != value));
        insumoSeleccionado.cantidad = 0;
        setListaInsumos([...listaInsumos, insumoSeleccionado]);
        if(isEditing){
            const hayMatch = re.insumo.find(i => {
                const i1 = {...i, cantidad: Number(i.cantidad)};
                const i2 = {...insumoSeleccionado, cantidad: Number(insumoSeleccionado.cantidad)}
                console.log(i1, i2);
                return isEqual(i1, i2);
            });
            console.log(hayMatch);
            setAreChanges(!hayMatch);
        }
    }

    const handleClickBtnListaInsumos = e => { //agregamos el insumo y lo sacamos de la lista de insumos
        setListaInsumos(listaInsumos.filter(lins => lins.value != e.value));
        setInsumos([...insumos, e]);
        if(isEditing){
            console.log(e)
            console.log(re.insumo.includes());
        }
    }

    const handleReset = () => {
        setListaInsumos(re?.insumo || []);
        setFormData({ nombre: re?.nombre || "", descripcion: re?.descripcion || "", insumo: [] });
        setInsumos(ins);
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="col-md-4 mb-3">
            <label className="form-label">Nombre</label>
            <input name="nombre" autoComplete="off" onChange={handleChange} type="text" className="form-control" value={formData.nombre} required />
        </div>
        <div className="col-md-8 mb-3">
            <label className="form-label">Descripción</label>
            <input name="descripcion" autoComplete="off" onChange={handleChange} type="text" className="form-control" value={formData.descripcion} required />
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">Insumos</label>
            <Select name="insumos" options={insumos} onChange={handleSelect} />
        </div>
        <div className="col-md-8 mb-3">
            <label className="form-label fw-semibold">Lista de insumos</label>
            <ul className="list-group shadow-sm rounded-4 overflow-hidden">
                {listaInsumos.map((l) => (
                    <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3">
                        <div className="d-flex align-items-center flex-grow-1">
                            <span className="fw-medium">{l.label}</span>
                        </div>
                        <div className="d-flex align-items-center ms-3">
                            <input type="number" name="insumo" data-id={l.value} value={l.cantidad || 0} onChange={handleChange} className="form-control form-control-sm text-end" style={{ width: "150px" }} placeholder={"cantidad ("+l.simbolo+")"} required/>
                            <small className="ms-2 text-muted">{l.simbolo}</small>
                        </div>
                        <button type="button" className="btn btn-sm ms-3 p-1" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon  icon={faTrash} className="text-danger" style={{color: "#ff0000",}}/></button>
                    </li>
                ))}
            </ul>
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={!isEditing ? false : isEditing && areChanges ? false : true}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
            <input className="btn btn-secondary" type="button" disabled={!isEditing ? false : isEditing && areChanges ? false : true} onClick={handleReset} value={"Cancelar"} />
        </div>
    </form>
}

export default FormReceta;