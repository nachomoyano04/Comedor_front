import { useEffect, useState } from "react"

const FormInsumo = ({insumo = null, unidades_de_medida, onSubmit}) => {
    const [formData, setFormData] = useState({
        codigo: insumo?.codigo || "",
        producto: insumo?.producto || "",
        marca: insumo?.marca || "",
        id_unidad_de_medida: insumo?.id_unidad_de_medida || ""
    });
    useEffect(() => {
        if(insumo){
            setFormData({
                codigo: insumo?.codigo || "",
                producto: insumo?.producto || "",
                marca: insumo?.marca || "",
                id_unidad_de_medida: insumo?.id_unidad_de_medida || ""
            });
            setAreChanges(false);
        }
    }, [insumo]);

    const isEditing = insumo !== null;
    const [areChanges, setAreChanges] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    const handleChange = e => {
        const {name} = e.target;
        let {value} = e.target;
        const {id, estado, ...restInsumo} = insumo;
        const newFormData = {...formData, [name]: value};    
        setFormData(newFormData);
        console.log(newFormData);
        console.log(restInsumo);
        if(isEditing){
            setAreChanges(JSON.stringify(restInsumo) == JSON.stringify(newFormData));
            // console.log(JSON.stringify(restInsumo));
            // console.log(JSON.stringify(newFormData));
            // console.log(JSON.stringify(restInsumo) == JSON.stringify(newFormData));
        }
    }

    const handleReset = () => {

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
                    <select name="id_unidad_de_medida" className="form-select" onChange={handleChange} defaultValue={isEditing? insumo.id_unidad_de_medida : "" }>
                        {unidades_de_medida.map(udm => {
                            return <option key={udm.id} value={udm.id}>{udm.nombre} ({udm.simbolo})</option>
                        })}
                    </select>
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={!isEditing? false:isEditing && areChanges? false : true}>{isEditing?"Guardar cambios":"Registrar"}</button>
                    <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} onClick={handleReset} value={"Cancelar"}/>
                </div>
            </form>
    </>
}

export default FormInsumo;