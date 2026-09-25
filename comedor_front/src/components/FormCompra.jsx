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
                    const cantidad = parseFloat(String(formUpdated.cantidad).replace(",", ".")) || 1; 
                    const precio_unitario = parseFloat(String(formUpdated.precio_unitario).replace(",", ".")) || 0; 
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
        const precioUnitarioNum = parseFloat(String(formData.precio_unitario).replace(",", "."));
        const cantidadNum = parseFloat(String(formData.cantidad).replace(",", "."));
        if (!precioUnitarioNum || precioUnitarioNum <= 0) {
            alert("Por favor ingrese un precio unitario válido mayor a 0");
            return;
        }
        if (!formData.insumo_id || !formData.proveedor_id) {
            alert("Debe seleccionar un insumo y un proveedor");
            return;
        }
        onSubmit({
            ...formData,
            precio_unitario: precioUnitarioNum,
            cantidad: cantidadNum > 0 ? cantidadNum : 1
        });
    }

    return <>
        <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
                <label className="form-label">Insumo</label>
                <Select required name="insumo_id" onChange={handleChange} value={formData.insumo_id ? {value: formData.insumo_id, label: formData.insumo_nombre } : null} options={insumos} placeholder="Seleccionar insumo..."></Select>  
            </div>
            <div className="col-md-6">
                <label className="form-label">Proveedor</label>
                <Select required name="proveedor_id" onChange={handleChange} value={formData.proveedor_id ? {value: formData.proveedor_id, label: formData.proveedor_razon_social } : null} options={proveedores} placeholder="Seleccionar proveedor..."></Select>
            </div>
            <div className="col-md-4">
                <label className="form-label">Precio unitario {udmInsumoActual && `(${udmInsumoActual.nombre}/ ${udmInsumoActual.simbolo})`}</label>
                <input name="precio_unitario" onChange={handleChange} value={formData.precio_unitario} type="text" placeholder="Ej: 1500.50" className="form-control" required/>
            </div>
            <div className="col-md-4">
                <label className="form-label">Fecha</label>
                <input name="fecha_desde" onChange={handleChange} value={formData.fecha_desde} type="datetime-local" className="form-control" required/>
            </div>
            <div className="col-md-4">
                <label className="form-label">Vencimiento (Opcional)</label>
                <input name="fecha_vencimiento" onChange={handleChange} value={formData.fecha_vencimiento} type="date" className="form-control"/>
            </div>
            <div className="col-md-6">
                <label className="form-label">Cantidad</label>
                <input name="cantidad" onChange={handleChange} value={formData.cantidad} type="number" step="any" min={"0.01"} className="form-control" required/>
            </div>
            <div className="col-md-6">
                <label className="form-label">Precio total (Calculado)</label>
                <input name="precio_total" value={formData.precio_total} type="text" readOnly className="form-control bg-light"/>
            </div>
            <div className="col-12 d-flex justify-content-end gap-2">
                <button className="btn btn-primary" type="submit">Guardar</button>
                <input className="btn btn-secondary ms-2" type="button" onClick={handleReset} value={"Cancelar"}/>
            </div>
        </form>
    </>
}

export default FormCompra;