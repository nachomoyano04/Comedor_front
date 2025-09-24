import {useState} from "react"
const UsuarioForm = ({roles}) => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [cuil, setCuil] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState([]);
    const handleRegistrarBtn = e => {
        e.preventDefault();
        console.log({nombre, apellido, dni, cuil, telefono, rol})
    }

    return <>
            <form className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input onChange={e => setNombre(e.target.value)} type="text" className="form-control" required/>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input onChange={e => setApellido(e.target.value)} type="text" className="form-control" required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">DNI</label>
                    <input onChange={e => setDni(e.target.value)} type="number" className="form-control"  required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">CUIL</label>
                    <input onChange={e => setCuil(e.target.value)} type="text" className="form-control" required/>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Teléfono</label>
                    <input onChange={e => setTelefono(e.target.value)} type="text" className="form-control" required/>
                </div>
                <div className="col-md-12">
                    <label className="form-label">Roles</label>  
                    {roles.map(r => 
                        <div className="form-check" key={r.id}>
                            <input name="rol" onChange={() => setRol(prev => [...prev, r.id])} value={r.id} className="form-check-input" type="checkbox" />
                            <label className="form-check-label">{r.nombre_rol}</label>
                        </div>
                    )}
                </div>
                <div className="col-12">
                    <button className="btn btn-primary" onClick={handleRegistrarBtn} type="submit">Registrar</button>
                </div>
            </form>
    </>
}

export default UsuarioForm;