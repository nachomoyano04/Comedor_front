import { useState } from "react";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const FormReceta = ({ re, ins, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: re?.nombre || "", descripcion: re?.descripcion || "", insumo: []
    })
    const [listaInsumos, setListaInsumos] = useState([]);
    const [insumos, setInsumos] = useState(ins);

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
        }else{ // Para manejar el nombre y la descripcion...
            setFormData({...formData, [name]: value});
        }
    }

    const handleSelect = (insumoSeleccionado) => { //sacar el insumo de los insumos y agregarlo a listaInsumos...
        const { value } = insumoSeleccionado;
        setInsumos(insumos.filter(i => i.value != value));
        insumoSeleccionado.cantidad = 0;
        setListaInsumos([...listaInsumos, insumoSeleccionado]);
    }

    const handleClickBtnListaInsumos = e => { //agregamos el insumo y lo sacamos de la lista de insumos
        setListaInsumos(listaInsumos.filter(lins => lins.value != e.value));
        setInsumos([...insumos, e]);
    }

    const handleReset = () => {
        setListaInsumos([]);
        setFormData({ nombre: re?.nombre || "", descripcion: re?.descripcion || "", insumos: [] });
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
            <ul className="list-group shadow-sm rounded-3">
                {listaInsumos.map((l) => (
                    <li key={l.value} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{l.label}</span>
                        <input type="number" name="insumo" data-id={l.value} onChange={handleChange} className="form-control form-control-sm ms-3" style={{ width: "150px" }} placeholder={"cantidad ("+l.simbolo+")"} required/>
                        <button type="button" className="btn" onClick={() => handleClickBtnListaInsumos(l)}><FontAwesomeIcon  icon={faTrash} style={{color: "#ff0000",}}/></button>
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