import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../services/AuthProvider";
import { getUsuarioByDni, updateUsuario } from "../services/api_endpoints";
import { useNavigate } from "react-router-dom";
import FormUsuario from "../components/FormUsuario";
import Swal from "sweetalert2"

export const PerfilUser = () => {
    const { user, setUser } = useContext(AuthContext);
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const resUser = await getUsuarioByDni(user.dni);
                setUsuario(resUser[0]);
            } catch (err) {
                console.log(err);
                setError("Error al obtener el usuario");
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const handleSubmitForm = async formData => {
        try {
            const answer = await updateUsuario(formData, usuario.id);
            await Swal.fire({ title: answer, icon: "success", timer: 2000 });
            setUser(prev => ({ ...prev, nombre: formData.nombre }));
            navigate("/usuario/listado");
        } catch (err) {
            Swal.fire({ title: err.response ? err.response.data.error : err, icon: "error" })
        }
    }

    return <>
        {/* Card Header */}
        <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Perfil Usuario</h5>
        </div>
        {/* Card Body */}
        <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="card-body d-flex justify-content-center">
                    <div style={{ width: "100%", maxWidth: "800px" }}>
                        <FormUsuario u={usuario} onSubmit={handleSubmitForm} />
                    </div>
                </div>
            )}
        </div>
    </>
} 