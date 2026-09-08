import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUsuarioByDni } from "./api_endpoints";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = jwtDecode(token);

      const getUserLogged = async () => {
        try {
          const response = await getUsuarioByDni(payload.dni);
          // response es un array (una fila por rol, por el LEFT JOIN de findUsuarioByDNI).
          // Lo normalizamos a la misma forma que arma Login.jsx con el JWT.
          const usuarioNormalizado = response.reduce((acc, fila) => {
            if (!acc) {
              acc = {
                id: fila.id,
                nombre: fila.nombre,
                apellido: fila.apellido,
                dni: fila.dni,
                cuil: fila.cuil,
                correo: fila.correo,
                telefono: fila.telefono,
                estado: fila.estado,
                roles: [],
              };
            }
            if (fila.rol_id) acc.roles.push(fila.rol_id);
            return acc;
          }, null);
          setUser(usuarioNormalizado);
        } catch (err) {
          console.log(err);
          localStorage.removeItem("token");
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      getUserLogged();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
