import { useEffect, useState } from "react";
import ListaUsuarios from "../components/ListaUsuarios";
import { changeStateUsuarioById, getUsuarios } from "../services/api";
import Swal from "sweetalert2";
const Users = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getUsuarios();
                setUsuarios(response);
            } catch (err) {
                setError(err);
            } finally{
                setLoading(false);
            }
        };
        loadUsers();
    }, []);
    
    const handleStateUser = (id, state) => {
        Swal.fire({
            title: `Esta seguro que desea dar de ${state === 1?"baja":"alta"} al usuario?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        }).then(async res => {
            if(res.isConfirmed){
                const answer = await changeStateUsuarioById(id, state);
                await Swal.fire({
                    title: answer,
                    icon: "success"
                });
                setUsuarios(usuarios.map(u => {
                    if(u.id === id){
                        return {...u, estado: state === 1? 0:1}; //Luego de cambiar el estado cambiamos el useState(usuario)
                    }
                    return u;
                }));
            }
        });
    }

    return <>
        <h1 className="card-title my-4">Usuarios</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading?(<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                 </div>) : (<ListaUsuarios usuarios={usuarios} onClickChangeState={handleStateUser} />)
        }
        
    </>
}

export default Users;