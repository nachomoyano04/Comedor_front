import { useEffect, useState } from "react";
import { loginUser } from "../services/api_endpoints";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({dni: "", password: "", remember: false});

    useEffect(() => {
        localStorage.removeItem("token");
    }, []);

    const handleSubmitForm = async e => {
        e.preventDefault();
        try {
            const data = await loginUser(formData);
            const {access_token, refresh_token, mensaje} = data;
            await Swal.fire({icon: "success", title: mensaje, timer: 3000});
            localStorage.setItem("token", access_token);
            navigate("/produccion/listado")
        } catch (error) {
            console.log(error);
            if(error.status == 401){
                Swal.fire({icon: "warning", title: error.response.data});
            }else{
                Swal.fire({icon: "error", title: error.response.data.error});
            }
        }
    }

    const handleChange = e => {
        const {name, value, checked} = e.target;
        setFormData({...formData, [name]: name != "remember"? value: checked});
    }

    return <div className="d-flex bg-dark justify-content-center align-items-center vh-100 bg-light p-3">
        <div className="card shadow-sm border-0 p-4" style={{ maxWidth: "400px", width: "100%" }}>
            <h2 className="text-center mb-4">Login</h2>
            <form onSubmit={handleSubmitForm}>
                <div className="mb-3">
                    <label htmlFor="dni" className="form-label">DNI</label>
                    <input type="text" autoComplete="off" className="form-control" value={formData.dni} onChange={handleChange} id="dni" name="dni" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" autoComplete="off" className="form-control" value={formData.password} onChange={handleChange} id="password" name="password" />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" checked={formData.remember} onChange={handleChange} className="form-check-input" id="remember" name="remember" />
                    <label className="form-check-label" htmlFor="remember">Recordarme</label>
                </div>
                <div className="g-signin2" data-onsuccess="onSignIn"></div>
                <button type="submit" className="btn btn-primary w-100 py-2">Ingresar</button>
            </form>
        </div>
    </div>
}

export default Login;