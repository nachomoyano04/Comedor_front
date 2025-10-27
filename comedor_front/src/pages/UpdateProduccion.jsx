import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduccionById } from "../services/api";

const UpdateProduccion = () => {
    const {id} = useParams();
    const [produccion, setProduccion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProdu = async () => {
            try {
                const resultado = await getProduccionById(id);
                console.log(resultado);
                setProduccion(resultado);
            } catch (err) {
                console.log(err);
                setError("Error al obtener producción");
            } finally{
                setLoading(false);
            }
        }
        loadProdu();
    }, []);
    return 
}

export default UpdateProduccion;