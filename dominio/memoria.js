const memoria = {

    leer: function(clave) {
        const datos = localStorage.getItem(clave);
        if (datos) {
            return JSON.parse(datos);
        } else {
            this.escribir(clave, []);
            return [];
        }
    },

    escribir: function(clave, lista) {
        localStorage.setItem(clave, JSON.stringify(lista));
    },
    
};