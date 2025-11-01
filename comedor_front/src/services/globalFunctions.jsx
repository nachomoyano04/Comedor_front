export const trimer = (a, b) => {
    if(typeof a == "string" && typeof b == "string"){
        return a.trim() == b.trim();
    }
}