import axios from "axios";

const BASE_URL = "http://localhost:6970";

export const getInsumos = async () => {
    try {
        const response = await axios(`${BASE_URL}/insumos`);
        return response.data;
    } catch (error) {
        throw error;
    }
}