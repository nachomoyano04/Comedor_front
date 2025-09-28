import { useEffect, useState } from "react"

const FormInsumo = ({insumo = null, unidades_de_medida, onSubmit}) => {
    const [formData, setFormData] = useState({
        codigo: insumo?.codigo || "",
        producto: insumo?.producto || "",
        marca: insumo?.marca || "",
        id_unidad_de_medida: insumo?.id_unidad_de_medida || unidades_de_medida[0].id
    });
    useEffect(() => {
        if(insumo){
            setFormData({
                codigo: insumo?.codigo || "",
                producto: insumo?.producto || "",
                marca: insumo?.marca || "",
                id_unidad_de_medida: insumo?.id_unidad_de_medida || unidades_de_medida[0].id
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
        const {name, value} = e.target;
        const newFormData = {...formData, [name]: value};    
        setFormData(newFormData);
        if(isEditing && insumo){
            const {id, estado, ...restInsumo} = insumo;
            const areEqual = (a, b) => {
                return Object.keys(a).every(key => String(a[key]) === String(b[key]));
            }
            setAreChanges(!areEqual(restInsumo, newFormData));
        }
    }

    const handleReset = () => {
        if(insumo){
            setFormData({
                codigo: insumo.codigo || "",
                producto: insumo.producto || "",
                marca: insumo.marca || "",
                id_unidad_de_medida: insumo.id_unidad_de_medida || unidades_de_medida[0].id
            })
            setAreChanges(false);
        }else{
            setFormData({
                codigo: "",
                producto: "",
                marca: "",
                id_unidad_de_medida: unidades_de_medida[0].id
            })
        }
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
                <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={!isEditing? false:isEditing && areChanges? false : true}>{isEditing?"Guardar cambios":"Registrar"}</button>
                    <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} onClick={handleReset} value={"Cancelar"}/>
                </div>
            </form>
    </>
}

export default FormInsumo;