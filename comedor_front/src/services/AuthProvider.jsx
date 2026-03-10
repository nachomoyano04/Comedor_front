import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react"
import { getUsuarioByDni } from "./api_endpoints";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = jwtDecode(token);
            const getUserLogged = async () => {
                const response = await getUsuarioByDni(payload.dni);
                console.log(response);
                console.log(payload);
                setUser(response);
            }
            getUserLogged();
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}