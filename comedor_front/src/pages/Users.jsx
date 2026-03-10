import { useContext, useEffect, useState } from "react";
import ListaUsuarios from "../components/ListaUsuarios";
import { changeStateUsuarioById, getUsuarios } from "../services/api_endpoints";
import Swal from "sweetalert2";
import { AuthContext } from "../services/AuthProvider";

const Users = () => {
    const { user } = useContext(AuthContext);
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getUsuarios();
                // Sacamos de la lista de usuarios al usuario logueado
                setUsuarios(response.filter(u => u.id != user.id));
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleStateUser = async (id, state) => {
        const res = await Swal.fire({
            title: `Esta seguro que desea dar de ${state === 1 ? "baja" : "alta"} al usuario?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si"
        });
        if (res.isConfirmed) {
            try {
                const answer = await changeStateUsuarioById(id, state);
                await Swal.fire({ title: answer, icon: "success" });
                setUsuarios(usuarios.map(u => {
                    if (u.id === id) {
                        return { ...u, estado: state === 1 ? 0 : 1 }; //Luego de cambiar el estado cambiamos el useState(usuario)
                    }
                    return u;
                }));
            } catch (err) {
                await Swal.fire({ icon: "error", title: err.response.data.error })
            }
        }
    }

    return <>
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Lista de usuarios</h5>
        </div>
        <div className="card-body">
            {error && <span className="bs-danger">{error}</span>}
            {loading ? (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>) :
                (<ListaUsuarios usuarios={usuarios} onClickChangeStateUsuario={handleStateUser} />)
            }
        </div>
    </>
}

export default Users;