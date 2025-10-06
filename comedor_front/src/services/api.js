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

export const updateUsuario = async (usuario, id) => {
    try {
        const response = await axios.put(`${BASE_URL}/usuario/${id}`, usuario);
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

export const changeStateUsuarioById = async (id, state) => {
    try {
        if(state === 1){
            const response = await axios.patch(`${BASE_URL}/usuario/del/${id}`);
            return response.data;
        }
        const response = await axios.patch(`${BASE_URL}/usuario/alt/${id}`);
        return response.data;
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

export const getInsumo = async id => {
    try {
        const response = await axios(`${BASE_URL}/insumos/id/${id}`);
        return response.data[0];
    } catch (error) {
        throw error;
    }
}

export const createInsumo = async insumo => {
    try {
        const response = await axios.post(`${BASE_URL}/insumos`, insumo);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateInsumo = async (id, insumo) => {
    try {
        const response = await axios.put(`${BASE_URL}/insumos/${id}`, insumo);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateInsumoById = async (id, estado) => {
    try {
        if(estado == 1){
            const response = await axios.patch(`${BASE_URL}/insumos/del/${id}`);
            return response.data;
        }
        const response = await axios.patch(`${BASE_URL}/insumos/act/${id}`);
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

export const getRolesByUser = async usuario_id => {
    try {
        const response = await axios(`${BASE_URL}/roles/usuario/${usuario_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Unidades de medida
export const getUdm = async() => {
    try {
        const response = await axios(`${BASE_URL}/udm`);
        return response.data;
    } catch (error) {
        
    }
}

//Proveedores 
export const getProveedores = async () => {
    try {
        const resultado = await axios(`${BASE_URL}/proveedor`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const getProveedor = async id => {
    try {
        const resultado = await axios(`${BASE_URL}/proveedor/${id}`);
        return resultado.data[0];
    } catch (error) {
        throw error;
    }
}

export const createProveedor = async proveedor => {
    try {
        const resultado = await axios.post(`${BASE_URL}/proveedor`, proveedor);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const updateProveedor = async (id, proveedor) => {
    try {
        const resultado = await axios.put(`${BASE_URL}/proveedor/${id}`, proveedor);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateProveeById = async (id, estado) => {
    try {
        if(estado == 1){
            const resultado = await axios.patch(`${BASE_URL}/proveedor/del/${id}`);
            return resultado.data;
        }else{
            const resultado = await axios.patch(`${BASE_URL}/proveedor/alt/${id}`);
            return resultado.data;
        }
    } catch (error) {
        throw error;
    }
}