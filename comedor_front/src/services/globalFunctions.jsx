export const trimer = (a, b) => {
    if(typeof a == "string" && typeof b == "string"){
        return a.trim() == b.trim();
    }
}

export const parsearHoraDateTime = hora => {
    return new Date(new Date(hora).getTime() + new Date().getTimezoneOffset() * 60000).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
}

export const parsearFechaDate = fecha => {
    return fecha.split("T")[0].split("-").reverse().join("/");
}