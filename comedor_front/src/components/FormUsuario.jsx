import {useState} from "react"
const FormUsuario = ({roles, onSubmit}) => {
    const [formData, setFormData] = useState({nombre:"", apellido:"", dni:"", cuil:"", telefono:"", rol:[]});

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(formData);
    }

    const handleChange = e => {
        const {name, value, checked} = e.target;
        if(name === "rol"){
            setFormData(prev => ({...prev, rol: checked? [...prev.rol, value] : prev.rol.filter(r => r !== value) }));
        }else{
            setFormData(prev => ({...prev, [name]: value}));
        }
    }

    return <>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" onChange={handleChange} type="text" className="form-control" required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input name="apellido" onChange={handleChange} type="text" className="form-control" required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">DNI</label>
                    <input name="dni" onChange={handleChange} type="text" className="form-control"  required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">CUIL</label>
                    <input name="cuil" onChange={handleChange} type="text" className="form-control" required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Teléfono</label>
                    <input name="telefono" onChange={handleChange} type="text" className="form-control" required/>
                </div>
                <div className="col-md-12">
                    <label className="form-label">Roles</label>  
                    {roles.map(r => 
                        <div className="form-check" key={r.id}>
                            <input name="rol" onChange={handleChange} value={r.id} className="form-check-input" type="checkbox" />
                            <label className="form-check-label">{r.nombre_rol}</label>
                        </div>
                    )}
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Registrar</button>
                </div>
            </form>
    </>
}

export default FormUsuario;