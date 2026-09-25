import { useContext, useState } from "react";
import { loginUser } from "../services/api_endpoints";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthProvider";
import { jwtDecode } from "jwt-decode";
import { FaUtensils, FaIdCard, FaLock } from "react-icons/fa";

const Login = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ dni: "", password: "", remember: false });
    const [cargando, setCargando] = useState(false);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            const data = await loginUser(formData);
            const { access_token, refresh_token, mensaje } = data;
            await Swal.fire({
                icon: "success",
                title: mensaje || "¡Bienvenido/a!",
                timer: 1500,
                showConfirmButton: false
            });

            localStorage.setItem("token", access_token);
            if (refresh_token) {
                localStorage.setItem("refresh_token", refresh_token);
            }
            const payload = jwtDecode(access_token);
            setUser(payload);

            navigate("/");
        } catch (error) {
            console.log(error);
            const status = error.response?.status;
            const errorMsg = error.response?.data?.error || error.response?.data || error.message || "Error al iniciar sesión";
            Swal.fire({
                icon: status === 401 ? "warning" : "error",
                title: typeof errorMsg === "string" ? errorMsg : "DNI y/o contraseña incorrectos",
                confirmButtonColor: "#2563eb"
            });
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData({ ...formData, [name]: name !== "remember" ? value : checked });
    };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center p-3" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
            <div className="card border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: "440px", width: "100%", borderRadius: "1.25rem", background: "#ffffff" }}>

                {/* Brand Header */}
                <div className="text-center mb-4">
                    <div
                        className="mx-auto d-flex align-items-center justify-content-center shadow-sm mb-3"
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            color: "#ffffff",
                            fontSize: "1.6rem"
                        }}
                    >
                        <FaUtensils />
                    </div>
                    <h2 className="fw-bold mb-1" style={{ color: "#0f172a", letterSpacing: "-0.02em" }}>Comedor Escolar</h2>
                    <p className="text-muted small mb-0">Sistema de Gestión de Alimentos y Producción</p>
                </div>

                <form onSubmit={handleSubmitForm}>
                    <div className="mb-3">
                        <label htmlFor="dni" className="form-label small fw-semibold text-secondary">
                            Número de Documento (DNI)
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 text-muted">
                                <FaIdCard />
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="username"
                                className="form-control bg-light border-start-0 ps-0"
                                value={formData.dni}
                                onChange={handleChange}
                                id="dni"
                                name="dni"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label small fw-semibold text-secondary">
                            Contraseña
                        </label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 text-muted">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                autoComplete="current-password"
                                className="form-control bg-light border-start-0 ps-0"
                                value={formData.password}
                                onChange={handleChange}
                                id="password"
                                name="password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                        disabled={cargando}
                        style={{ borderRadius: "0.6rem" }}
                    >
                        {cargando ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {cargando ? "Ingresando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-4 pt-3 border-top text-center">
                    <small className="text-muted" style={{ fontSize: "0.78rem" }}>
                        Acceso restringido a personal autorizado de la institución.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default Login;