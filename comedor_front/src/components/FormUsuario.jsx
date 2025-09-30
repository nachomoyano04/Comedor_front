import {useEffect, useState} from "react"
const FormUsuario = ({usuario = null, rolesUser = null, roles, onSubmit}) => {
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "", 
        dni: usuario?.dni || "", 
        cuil: usuario?.cuil || "", 
        telefono: usuario?.telefono || "", 
        rol: rolesUser || []
    });
    const isEditing = usuario !== null
    const [areChanges, setAreChanges] = useState(false);

    useEffect(() => {
        if(usuario){
            setFormData({
                nombre: usuario?.nombre || "",
                apellido: usuario?.apellido || "",
                dni: usuario?.dni || "",
                cuil: usuario?.cuil || "",
                telefono: usuario?.telefono || "",
                rol: rolesUser || []
            });
            setAreChanges(false);
        }
    }, [usuario, rolesUser])

    const handleSubmit = e => {
        e.preventDefault();
        if(!isEditing || (isEditing && areChanges)){
            onSubmit(formData);
        }
    }

    const handleChange = e => {
        const {name, value, checked} = e.target;
        const newFormData = name === "rol"
        ?{...formData, rol: checked ? [...formData.rol, Number(value)] : formData.rol.filter(r => r !== Number(value)) }
        :{...formData, [name]: value};
        
        setFormData(newFormData);
        if(usuario !== null){ // => esta editando
            const {id, estado, password, ...filteredUsuario} = usuario;
            filteredUsuario.rol = rolesUser.sort((a,b)=>a-b);
            newFormData.rol.sort((a,b) => a-b);
            setAreChanges(JSON.stringify(filteredUsuario) !== JSON.stringify(newFormData));
        }
    }

    const handleReset = () => {
        if(usuario){
            setFormData({
                nombre: usuario?.nombre || "",
                apellido: usuario?.apellido || "",
                dni: usuario?.dni || "",
                cuil: usuario?.cuil || "",
                telefono: usuario?.telefono || "",
                rol: rolesUser || []
            });
            setAreChanges(false);
        }else{
            setFormData({
                nombre:"",apellido:"",dni:"",cuil:"",telefono:"",rol:[]
            });
        }
    }

    return <>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" onChange={handleChange} type="text" className="form-control form-control-lg" value={formData.nombre} required/>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Apellido</label>
                    <input name="apellido" onChange={handleChange} type="text" className="form-control form-control-lg" value={formData.apellido} required/>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">DNI</label>
                    <input name="dni" onChange={handleChange} type="text" className="form-control form-control-lg"  value={formData.dni} required/>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">CUIL</label>
                    <input name="cuil" onChange={handleChange} type="text" className="form-control form-control-lg" value={formData.cuil} required/>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Teléfono</label>
                    <input name="telefono" onChange={handleChange} type="text" className="form-control form-control-lg" value={formData.telefono} required/>
                </div>
                <div className="col-md-12 mb-3 p-2 bg-light rounded">
                    <legend className="small">Roles</legend>
                    {roles.map(r => 
                        <div className="form-check mb-1" key={r.id}>
                            <input name="rol" onChange={handleChange} value={r.id} checked={formData.rol.includes(r.id)} className="form-check-input" type="checkbox" />
                            <label className="form-check-label">{r.nombre_rol}</label>
                        </div>
                    )}
                </div>
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-primary" type="submit" disabled={!isEditing? false:isEditing && areChanges? false : true}>{isEditing?"Guardar cambios":"Registrar"}</button>
                    <input className="btn btn-secondary" type="button" disabled={!isEditing? false:isEditing && areChanges? false : true} onClick={handleReset} value={"Cancelar"}/>
                </div>
            </form>
    </>
}

export default FormUsuario;