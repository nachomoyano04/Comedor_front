import api from "./api";
//Usuario
export const loginUser = async loginData => {
    try {
        const response = await api.post(`/usuario/login`, loginData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUsuarios = async () => {
    try {
        const response = await api(`/usuario`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createUsuario = async usuario_y_roles => {
    try {
        const response = await api.post(`/usuario`, usuario_y_roles);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUsuario = async (usuario, id) => {
    try {
        console.log(usuario);
        const response = await api.put(`/usuario/${id}`, usuario);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUsuarioByDni = async dni => {
    try {
        const response = await api.get(`/usuario/dni/${dni}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateUsuarioById = async (id, state) => {
    try {
        if(state === 1){
            const response = await api.patch(`/usuario/del/${id}`);
            return response.data;
        }
        const response = await api.patch(`/usuario/alt/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changePasswordUser = async (actual, nueva, id) => {
    try {
        const response = await api.patch(`/usuario/pass/${id}`, {actual, nueva});
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Insumos
export const getInsumos = async () => {
    try {
        const response = await api(`/insumos`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getInsumosParaReceta = async () => {
    try {
        const response = await api(`/insumos/receta`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getInsumo = async id => {
    try {
        const response = await api(`/insumos/id/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createInsumo = async insumo => {
    try {
        const response = await api.post(`/insumos`, insumo);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateInsumo = async (id, insumo) => {
    try {
        const response = await api.put(`/insumos/${id}`, insumo);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateInsumoById = async (id, estado) => {
    try {
        if(estado == 1){
            const response = await api.patch(`/insumos/del/${id}`);
            return response.data;
        }
        const response = await api.patch(`/insumos/act/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Roles
export const getRoles = async () => {
    try {
        const response = await api(`/roles`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRolesByUser = async usuario_id => {
    try {
        const response = await api(`/roles/usuario/${usuario_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Unidades de medida
export const getUdm = async() => {
    try {
        const response = await api(`/udm`);
        return response.data;
    } catch (error) {
        
    }
}

//Proveedores 
export const getProveedores = async () => {
    try {
        const resultado = await api(`/proveedor`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const getProveedor = async id => {
    try {
        const resultado = await api(`/proveedor/${id}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const createProveedor = async proveedor => {
    try {
        const resultado = await api.post(`/proveedor`, proveedor);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const updateProveedor = async (id, proveedor) => {
    try {
        const resultado = await api.put(`/proveedor/${id}`, proveedor);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateProveeById = async (id, estado) => {
    try {
        if(estado == 1){
            const resultado = await api.patch(`/proveedor/del/${id}`);
            return resultado.data;
        }else{
            const resultado = await api.patch(`/proveedor/alt/${id}`);
            return resultado.data;
        }
    } catch (error) {
        throw error;
    }
}

//Contacto Proveedor
export const newContactoProveedor = async contacto_proveedor => {
    try {
        const resultado = await api.post(`/proveedor/contacto`, contacto_proveedor);
        return resultado.data;
    } catch (error) {
        throw error;
    }
} 

export const deleteContactoProveedor = async id_contacto => {
    try {
        const resultado = await api.delete(`/proveedor/contacto/${id_contacto}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

/* Precios-Compra */
export const getPrecios = async () => {
    try {
        const precios = await api(`/precio`);
        return precios.data;
    } catch (error) {
        throw error;
    }
}

export const getPreciosByInsumo = async insumo_id => {
    try {
        const precios = await api(`/precio/${insumo_id}`);
        return precios.data;
    } catch (error) {
        throw error;
    }
}

export const newCompra = async compra => {
    try {
        const resultado = await api.post(`/precio`, compra);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const deleteCompra = async id => {
    try {
        const resultado = await api.delete(`/precio/${id}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

// Recetas
export const getRecetas = async () => {
    try {
        const resultado = await api(`/receta`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const getRecetaById = async id => {
    try {
        const resultado = await api(`/receta/${id}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const newReceta = async receta => {
    try {
        const resultado = await api.post(`/receta`, receta);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateRecetaById = async (id, estado) => {
    try {
        if(estado == 1){
            const resultado = await api.patch(`/receta/del/${id}`);
            return resultado.data;
        }
        const resultado = await api.patch(`/receta/alt/${id}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const updateReceta = async (id, receta) => {
    try {
        const resultado = await api.put(`/receta/${id}`, receta);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

//Produccion
export const newProduccion = async produccion => {
    try {
        const resultado = await api.post(`/produccion`, produccion);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const updateProduccion = async (id, produccion) => {
    try {
        const resultado = await api.put(`/produccion/${id}`, produccion);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const getProducciones = async () => {
    try {
        const token = localStorage.getItem("token");
        const resultado = await api(`/produccion`, {headers: {Authorization: `Bearer ${token}`}});
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const getProduccionById = async id => {
    try {
        const resultado = await api(`/produccion/${id}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}

export const changeStateProduccionById = async (id, state) => {
    try {
        const resultado = await api.patch(`/produccion/${id}/estado/${state}`);
        return resultado.data;
    } catch (error) {
        throw error;
    }
}