import { useEffect, useState } from "react";
import FormInsumo from "../components/FormInsumo";

const RegisterInsumo = () => {
    const [unidades_de_medida, setUnidades_de_medida] = useState([]);

    useEffect(() => {

    })

    return <>
        <h1 className="card-title mt-3">Registro de usuario</h1>
        {error && <span className="bs-danger">{error}</span>}
        {loading? 
            (<div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>):
            (<div className="container  border border-danger my-3 py-3">
                <FormInsumo unidades_de_medida={unidades_de_medida} onSubmit={handleSubmitForm}/>
            </div>)};
    </>
}

export default RegisterInsumo;