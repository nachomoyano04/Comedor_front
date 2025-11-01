import { useState } from "react";
import { isEqualWith } from "lodash";
import { trimer } from "../services/globalFunctions";

const FormInsumo = ({insumo = null, unidades_de_medida, onSubmit}) => {
    const [formData, setFormData] = useState({
        codigo: insumo?.codigo || "",
        producto: insumo?.producto || "",
        marca: insumo?.marca || "",
        id_unidad_de_medida: insumo?.id_unidad_de_medida || unidades_de_medida[0].id
    });

    const isEditing = insumo !== null;
    const [areChanges, setAreChanges] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        const newFormData = {...formData, [name]: name == "id_unidad_de_medida"? Number(value) : value};    
        setFormData(newFormData);
        if(isEditing){
            let {id, estado, stock, ...restInsumo} = insumo;
            console.log(newFormData);
            console.log(restInsumo)
            setAreChanges(!isEqualWith(newFormData, restInsumo, trimer));
        }
    }

    const handleReset = () => {
            setFormData({
                codigo: insumo?.codigo || "0",
                producto: insumo?.producto || "",
                marca: insumo?.marca || "",
                id_unidad_de_medida: insumo?.id_unidad_de_medida || unidades_de_medida[0].id
            })
            isEditing && setAreChanges(false);
    }

    return <>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label className="form-label">Código</label>
                    <input name="codigo" onChange={handleChange} type="text" className="form-control" value={formData.codigo} required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Producto</label>
                    <input name="producto" onChange={handleChange} type="text" className="form-control" value={formData.producto} required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Marca</label>
                    <input name="marca" onChange={handleChange} type="text" className="form-control"  value={formData.marca} required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Unidad de medida</label>
                    <select name="id_unidad_de_medida" className="form-select" onChange={handleChange} value={formData.id_unidad_de_medida}>
                        {unidades_de_medida.map(udm => {
                            return <option key={udm.id} value={udm.id}>{udm.nombre} ({udm.simbolo})</option>
                        })}
                    </select>
                </div>
                <div className="col-12 d-flex justify-content-end gap-2">
                    <button className="btn btn-primary" type="submit" disabled={isEditing && !areChanges}>{isEditing?"Guardar cambios":"Registrar"}</button>
                    <input className="btn btn-secondary" type="button" disabled={isEditing && !areChanges} onClick={handleReset} value={"Cancelar"}/>
                </div>
                {isEditing && !areChanges && (
                    <div className="text-end">
                        <small style={{ color: "#555555", fontStyle: "italic" }}>No hay cambios aún</small>
                    </div>
                )}
            </form>
    </>
}

export default FormInsumo;