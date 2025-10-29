import { useEffect, useState } from "react";

const FormProveedor = ({proveedor = null, onSubmit}) => {
    const [formData, setFormData] = useState({ codigo: proveedor?.codigo || "", razon_social: proveedor?.razon_social || "", nombre_fantasia: proveedor?.nombre_fantasia || "", cuit: proveedor?.cuit || "", horarios_atencion: proveedor?.horarios_atencion || "", domicilio: proveedor?.domicilio || "", localidad: proveedor?.localidad || "", email: proveedor?.email || "", contactos: proveedor?.contactos || [] });
    const [areChanges, setAreChanges] = useState(false);

    useEffect(() => {
        setFormData({ codigo: proveedor?.codigo || "", razon_social: proveedor?.razon_social || "", nombre_fantasia: proveedor?.nombre_fantasia || "", cuit: proveedor?.cuit || "", horarios_atencion: proveedor?.horarios_atencion || "", domicilio: proveedor?.domicilio || "", localidad: proveedor?.localidad || "", email: proveedor?.email || "", contactos: proveedor?.contactos || [] });
        setAreChanges(false);
    }, [proveedor]);

    const isEditing = proveedor !== null;

    const handleChange = e => {
        const {name, value} = e.target;
        const newFormData = {...formData, [name]: value};
        setFormData(newFormData);
        //Logica de comparacion para ver si hay cambios o no...
        if(isEditing && proveedor){
            const {id, estado, ...restProveedor} = proveedor;
            const areEqual = (a,b) => {
                return Object.keys(a).every(key => String(a[key]) === String(b[key]));
            }
            setAreChanges(!areEqual(newFormData, restProveedor));
        }
    }

    const handleReset = origen => {
        if(origen == 1){ //formulario del proveedor
            setFormData({ codigo: proveedor?.codigo || "", razon_social: proveedor?.razon_social || "", nombre_fantasia: proveedor?.nombre_fantasia || "", cuit: proveedor?.cuit || "", horarios_atencion: proveedor?.horarios_atencion || "", domicilio: proveedor?.domicilio || "", localidad: proveedor?.localidad || "", email: proveedor?.email || "" });
            setAreChanges(false);
        }else{//formulario del contacto de proveedor

        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    return <>
        <form className="row g-2" onSubmit={handleSubmit}>
            <div className="col-md-4 mb-3">
                <label className="form-label">Codigo</label>
                <input name="codigo" onChange={handleChange} type="text" className="form-control" value={formData.codigo} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input name="email" onChange={handleChange} type="text" className="form-control" value={formData.email} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">CUIT</label>
                <input name="cuit" onChange={handleChange} type="text" className="form-control" value={formData.cuit} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Razón social</label>
                <input name="razon_social" onChange={handleChange} type="text" className="form-control" value={formData.razon_social} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Nombre fantasía</label>
                <input name="nombre_fantasia" onChange={handleChange} type="text" className="form-control"  value={formData.nombre_fantasia} required/>
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Horarios de atención</label>
                <input name="horarios_atencion" onChange={handleChange} type="text" className="form-control" value={formData.horarios_atencion} required/>
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Localidad</label>
                <input name="localidad" onChange={handleChange} type="text" className="form-control" value={formData.localidad} required/>
            </div>
            <div className="col-md-6 mb-3">
                <label className="form-label">Domicilio</label>
                <input name="domicilio" onChange={handleChange} type="text" className="form-control" value={formData.domicilio} required/>
            </div>
            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-primary" type="submit" disabled={!isEditing? false:isEditing && areChanges? false : true}>{isEditing?"Guardar cambios":"Registrar"}</button>
                <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} onClick={() => handleReset(1)} value={"Cancelar"}/>
            </div>
        </form>
        <hr/>
        <p className="d-inline-flex gap-1">
            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#formularioContactoProveedor" aria-expanded="false" aria-controls="collapseExample">Agregar contacto</button>
        </p>
        <div className="collapse" id="formularioContactoProveedor">
            <div className="card card-body">
                <form className="row g-2" onSubmit={handleSubmit}>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Nombre</label>
                        <input name="nombre" onChange={handleChange} type="text" className="form-control" value={formData.codigo} required/>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Telefono</label>
                        <input name="telefono" onChange={handleChange} type="text" className="form-control" value={formData.email} required/>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Email</label>
                        <input name="email" onChange={handleChange} type="text" className="form-control" value={formData.email} required/>
                    </div>
                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                        <button className="btn btn-primary" type="submit">Guardar</button>
                        <input className="btn btn-secondary" type="button" onClick={() => handleReset(2)} value={"Cancelar"}/>
                    </div>
                </form>
            </div>
        </div>
    </> 
}

export default FormProveedor;