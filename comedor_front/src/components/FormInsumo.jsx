import { useState } from "react"

const FormInsumo = ({insumo = null, unidades_de_medida, onSubmit}) => {
    const [formData, setFormData] = useState({
        codigo: insumo?.codigo || "",
        producto: insumo?.producto || "",
        marca: insumo?.marca || "",
        id_unidad_de_medida: insumo?.id_unidad_de_medida || ""
    });

    const isEditing = insumo !== null;
    const [areChanges, setAreChanges] = useState(false);

    const handleSubmit = () => {

    }

    const handleChange = e => {
        const {name, value} = e.target;
        const newFormData = {...formData, [name]: value};    
        setFormData(newFormData);
        // if(isEditing){
        //     insumo[name] === value;
        // }
    }
    return <>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label className="form-label">Código</label>
                    <input name="codigo" onChange={handleChange} type="text" className="form-control" value={formData.nombre} required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Producto</label>
                    <input name="producto" onChange={handleChange} type="text" className="form-control" value={formData.apellido} required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Marca</label>
                    <input name="marca" onChange={handleChange} type="text" className="form-control"  value={formData.dni} required/>
                </div>
                <div className="col-md-6">
                    <fieldset>
                        <legend>Unidad de medida</legend>
                        {unidades_de_medida.map(u => {
                            <div>
                                <input type="radio" value={u.nombre} name="id_unidad_de_medida" className="form-check-input"/>
                                <label htmlFor={u.nombre}>u.nombre</label>
                            </div>
                        })}
                    </fieldset>
                    <label className="form-label">Unidad de medida</label> 
                    <input type="radio" name="id_unidad_de_medida" className="form-check-input"/>
                    <input type="radio" name="id_unidad_de_medida" className="form-check-input"/>
                    {/* {unidades_de_medida.map(u => 
                        <div className="form-check" key={u.id}>
                            <input name="unidad_medida" onChange={handleChange} value={u.id} checked={formData.id_unidad_de_medida === u.id} className="form-check-input" type="radio" />
                            <label className="form-check-label">{u.nombre} ({u.simbolo})</label>
                        </div>
                    )} */}
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={!isEditing? false:isEditing && areChanges? false : true}>{isEditing?"Guardar cambios":"Registrar"}</button>
                    {/* <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} onClick={handleReset} value={"Cancelar"}/> */}
                    <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} value={"Cancelar"}/>
                </div>
            </form>
    </>
}

export default FormInsumo;