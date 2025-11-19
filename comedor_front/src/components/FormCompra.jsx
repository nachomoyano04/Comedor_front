import { useState } from "react";
import Select from "react-select"

const FormCompra = ({onSubmit, udm, insumos, proveedores}) => {
    const [formData, setFormData] = useState({
        insumo_id: "", 
        proveedor_id: "", 
        insumo_nombre: "", 
        proveedor_razon_social: "", 
        precio_unitario: "", 
        fecha_desde: "", 
        fecha_vencimiento: "", 
        cantidad: 1, 
        precio_total: 0
    });
    const [udmInsumoActual, setUdmInsumoActual] = useState("");

    const handleChange = e => {
        if(e.target){
            const {name, value} = e.target;
            setFormData(prev => {
                const formUpdated = {...prev, [name]: value};
                if(name == "cantidad" || name == "precio_unitario"){
                    const cantidad = parseFloat(formUpdated.cantidad) || 1; 
                    const precio_unitario = parseFloat(formUpdated.precio_unitario) || 0; 
                    formUpdated.precio_total = (cantidad * precio_unitario).toFixed(2);
                }
                return formUpdated;
            })
        }else{
            const {name, value ,label} = e;
            if(name == "insumo_id"){ //Seteamos la unidad de medida del insumo seleccionado...
                setUdmInsumoActual(udm.find(u => u.id == e.id_udm));
            }
            setFormData({...formData, [name]: value, [name == "insumo_id"? "insumo_nombre": "proveedor_razon_social"] : label });
        }
    }

    const handleReset = () => {
        setFormData({insumo_id: "", proveedor_id: "", insumo_nombre: "", proveedor_razon_social: "", precio_unitario: "", fecha_desde: "", fecha_vencimiento: "", cantidad: 1, precio_total: 0})
        setUdmInsumoActual("");
    }

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    return <>
        <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
                <label className="form-label">Insumo</label>
                <Select required name="insumo_id" onChange={handleChange} value={{value: formData.insumo_id, label: formData.insumo_nombre }} options={insumos}></Select>  
            </div>
            <div className="col-md-6">
                <label className="form-label">Proveedor</label>
                <Select required name="proveedor_id" onChange={handleChange} value={{value: formData.proveedor_id, label: formData.proveedor_razon_social }} options={proveedores}></Select>
            </div>
            <div className="col-md-4">
                <label className="form-label">Precio unitario {udmInsumoActual && `(${udmInsumoActual.nombre}/ ${udmInsumoActual.simbolo})`}</label>
                <input name="precio_unitario" onChange={handleChange} value={formData.precio_unitario} type="text" className="form-control" required/>
            </div>
            <div className="col-md-4">
                <label className="form-label">Fecha</label>
                <input name="fecha_desde" onChange={handleChange} value={formData.fecha_desde} type="datetime-local" className="form-control" required/>
            </div>
            <div className="col-md-4">
                <label className="form-label">Vencimiento</label>
                <input name="fecha_vencimiento" onChange={handleChange} value={formData.fecha_vencimiento} type="date" className="form-control" required/>
            </div>
            <div className="col-md-6">
                <label className="form-label">Cantidad</label>
                <input name="cantidad" onChange={handleChange} value={formData.cantidad} type="number" min={"0"} className="form-control" required/>
            </div>
            <div className="col-md-6">
                <label className="form-label">Precio total</label>
                <input name="precio_total" onChange={handleChange} value={formData.precio_total} type="number" disabled={formData.precio_unitario.length>0?"":"disabled"} className="form-control" required/>
            </div>
            <div className="col-12 d-flex justify-content-end gap-2">
                <button className="btn btn-primary" type="submit">Guardar</button>
                <input className="btn btn-secondary ms-2" type="button" onClick={handleReset} value={"Cancelar"}/>
            </div>
        </form>
    </>
}

export default FormCompra;