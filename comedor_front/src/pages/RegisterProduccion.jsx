import { useState } from "react";
import FormProduccion from "../components/FormProduccion";
import KitchenScreen from "../components/KitchenScreen";
import { newProduccion } from "../services/api_endpoints";
import Swal from "sweetalert2";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaTabletAlt, FaDesktop } from "react-icons/fa";

const RegisterProduccion = () => {
  const navigate = useNavigate();
  const { recetas, insumos } = useOutletContext();
  const [modoTablet, setModoTablet] = useState(true);

  const handleSubmitProduccion = async (formData) => {
    try {
      const r = await newProduccion(formData);
      const mensaje = r.mensaje || (typeof r === "string" ? r : "Producción registrada correctamente.");
      
      if (r.alertas && r.alertas.length > 0) {
        await Swal.fire({
          title: mensaje,
          html: `
            <div class="text-start mt-3">
              <p class="mb-1 text-secondary fw-semibold">El stock de los insumos fue descontado automáticamente. Se generaron las siguientes alertas:</p>
              <ul class="text-danger fw-semibold" style="list-style-type: square;">
                ${r.alertas.map(a => `<li class="mb-1">${a}</li>`).join("")}
              </ul>
            </div>
          `,
          icon: "warning",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#f59e0b"
        });
      } else {
        await Swal.fire({ 
          title: mensaje, 
          text: "Stock descontado del inventario exitosamente.",
          icon: "success", 
          timer: 2200 
        });
      }
      navigate("/produccion/listado");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data || err.message || "Error al registrar producción";
      Swal.fire({ 
        title: "Error al registrar producción", 
        text: typeof msg === "string" ? msg : JSON.stringify(msg), 
        icon: "error" 
      });
    }
  };

  const handleStandardSubmit = async (formData) => {
    const res = await Swal.fire({
      title: "¿Seguro desea registrar la producción?",
      text: "Se descontarán automáticamente los insumos utilizados del stock de la despensa.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, registrar",
    });
    if (res.isConfirmed) {
      await handleSubmitProduccion(formData);
    }
  };

  if (modoTablet) {
    return (
      <KitchenScreen 
        recetas={recetas} 
        insumosBD={insumos} 
        onSubmit={handleSubmitProduccion} 
        onSwitchToStandard={() => setModoTablet(false)}
      />
    );
  }

  return (
    <>
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Registrar Producción</h5>
        <button 
          type="button" 
          onClick={() => setModoTablet(true)} 
          className="btn btn-sm btn-light fw-bold d-flex align-items-center gap-2"
        >
          <FaTabletAlt />
          <span>Abrir Modo Tablet / Pantalla de Cocina</span>
        </button>
      </div>
      <div className="card-body">
        <FormProduccion insumosBD={insumos} recetas={recetas} onSubmit={handleStandardSubmit} />
      </div>
    </>
  );
};

export default RegisterProduccion;
