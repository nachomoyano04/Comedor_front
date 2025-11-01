import { useState } from "react";
import { isEqualWith } from "lodash";
import { trimer } from "../services/globalFunctions";

const FormUsuario = ({ usuario = null, roles, onSubmit }) => {
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        dni: usuario?.dni || "",
        cuil: usuario?.cuil || "",
        telefono: usuario?.telefono || "",
        rol: usuario?.rol || []
    });
    const isEditing = usuario !== null
    const [areChanges, setAreChanges] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    const handleChange = e => {
        const { name, value} = e.target;
        let newFormData;
        if(name == "rol"){
            const yaEstaIncluido = formData.rol.some(r => r == value);
            newFormData = {...formData, rol: yaEstaIncluido? formData.rol.filter(r => r != value).sort((a,b) => a-b): [...formData.rol, Number(value)].sort((a,b) => a-b)};
        }else{
            newFormData = {...formData, [name]: value};
        }
        if(isEditing){
            const {id, estado, ...restUsuario} = usuario;
            setAreChanges(!isEqualWith(newFormData, restUsuario, trimer));
        }
        setFormData(newFormData);
    }

    const handleReset = () => {
        setFormData({
            nombre: usuario?.nombre || "",
            apellido: usuario?.apellido || "",
            dni: usuario?.dni || "",
            cuil: usuario?.cuil || "",
            telefono: usuario?.telefono || "",
            rol: usuario?.rol || []
        });
        isEditing && setAreChanges(false);
    }

    return <form className="row g-2" onSubmit={handleSubmit}>
        <div className="col-md-6 mb-3">
            <label className="form-label">Nombre</label>
            <input name="nombre" onChange={handleChange} type="text" className="form-control" value={formData.nombre} required />
        </div>
        <div className="col-md-6 mb-3">
            <label className="form-label">Apellido</label>
            <input name="apellido" onChange={handleChange} type="text" className="form-control" value={formData.apellido} required />
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">DNI</label>
            <input name="dni" onChange={handleChange} type="text" className="form-control" value={formData.dni} required />
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">CUIL</label>
            <input name="cuil" onChange={handleChange} type="text" className="form-control" value={formData.cuil} required />
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label">Teléfono</label>
            <input name="telefono" onChange={handleChange} type="text" className="form-control" value={formData.telefono} required />
        </div>
        <div className="col-md-12 mb-3 p-2 bg-light rounded">
            <legend className="small">Roles</legend>
            {roles.map(r =>
                <div className="form-check mb-1" key={r.id}>
                    <input name="rol" onChange={handleChange} value={r.id} checked={formData.rol.some(rol => rol == r.id)} className="form-check-input" type="checkbox" />
                    <label className="form-check-label">{r.nombre_rol}</label>
                </div>
            )}
        </div>
        <div className="col-12 d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary" disabled={isEditing && !areChanges}>{isEditing ? "Guardar cambios" : "Registrar"}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={isEditing && !areChanges}>Cancelar</button>
        </div>
        {isEditing && !areChanges && (
            <div className="text-end">
                <small style={{ color: "#555555", fontStyle: "italic" }}>No hay cambios aún</small>
            </div>
        )}
    </form>
}

export default FormUsuario;