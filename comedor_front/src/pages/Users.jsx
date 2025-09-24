import { useEffect, useState } from "react";
import ListaUsuarios from "../components/ListaUsuarios";
import { getUsuarios } from "../services/api";
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

    return <>
        <h1 className="card-title my-4">Usuarios</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading?(<div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                 </div>) : (<ListaUsuarios usuarios={usuarios} />)
        }
        
    </>
}

export default Users;