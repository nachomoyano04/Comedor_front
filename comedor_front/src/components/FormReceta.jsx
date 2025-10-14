import { useState } from "react";
import Select from "react-select";

const FormReceta = ({re, ins, onSubmit}) => {
    const [formData, setFormData] = useState({
        nombre: re?.nombre||"", descripcion: re?.descripcion||"", fecha: re?.fecha||"", insumos: []
    })
    const [listaInsumos, setListaInsumos] = useState([]);
    const [insumos, setInsumos] = useState(ins);

    const isEditing = re != null;

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    const handleChange = () => {

    }

    const handleSelect = (insumoSeleccionado) => { //sacar el insumo de los insumos y agregarlo a listaInsumos...
        const {value, label} = insumoSeleccionado;
        setInsumos(insumos.filter(i =>  i.value != value));
        setListaInsumos([...listaInsumos, insumoSeleccionado]);
    }

    const handleReset = () => {
        setFormData({nombre: re?.nombre||"", descripcion: re?.descripcion||"", fecha: re?.fecha||"", insumos: []});
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="col-md-4 mb-3">
            <label className="form-label">Nombre</label>
            <input name="nombre" onChange={handleChange} type="text" className="form-control" value={formData.nombre} required/>
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">Descripción</label>
            <input name="descripcion" onChange={handleChange} type="text" className="form-control" value={formData.descripcion} required/>
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">Fecha</label>
            <input name="fecha" onChange={handleChange} type="text" className="form-control" value={formData.cuit} required/>
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">Insumos</label>
            <Select name="insumos" options={insumos} onChange={handleSelect}/>
        </div>
        <div className="col-md-8 mb-3">
            <label className="form-label">Lista de insumos</label>
            <ul className="list-group">
                {listaInsumos.map(l => {
                    return <li key={l.value} className="list-group-item">
                        <legend htmlFor="" className="form-check-label">{l.label}</legend>
                        <label htmlFor="" className="form-check-label">cantidad</label>
                        <input name="insumolista" className="form-control" type="number" />
                    </li>
                })}
            </ul>
        </div>
        <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={!isEditing? false:isEditing && areChanges? false : true}>{isEditing?"Guardar cambios":"Registrar"}</button>
            <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} onClick={handleReset} value={"Cancelar"}/>
        </div>
    </form>
}

export default FormReceta;