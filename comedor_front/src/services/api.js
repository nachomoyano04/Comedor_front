import axios from "axios";

const BASE_URL = "http://localhost:6970";

//Usuario

export const getUsuarios = async () => {
    try {
        const response = await axios(`${BASE_URL}/usuario`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createUsuario = async usuario_y_roles => {
    try {
        const response = await axios.post(`${BASE_URL}/usuario`, usuario_y_roles);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUsuarioByDni = async dni => {
    try {
        const response = await axios.get(`${BASE_URL}/usuario/dni/${dni}`);
        return response.data[0];
    } catch (error) {
        throw error;
    }
}

//Insumos
export const getInsumos = async () => {
    try {
        const response = await axios(`${BASE_URL}/insumos`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Roles
export const getRoles = async () => {
    try {
        const response = await axios(`${BASE_URL}/roles`);
        return response.data;
    } catch (error) {
        throw error;
    }
}