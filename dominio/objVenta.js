const Venta = {
    ventas: [],
    juguetes: [],
    totalRecaudado: 0,

inicializar: function () {
    this.juguetes = memoria.leer('juguetes');
    this.ventas = memoria.leer('ventas');
    this.listarJuguetes();
    this.listarVentas();
},

crearJuguete: function (codigo, nombre, precio, cantidad) {  
    	return {
        		codigo      : codigo,
        		nombre      : nombre,
        		precio      : precio,
           		cantidad    : cantidad,
                cantVentas  : 0
    	    };
},

crearVenta: function (codigo, juguete, precio, cantidad,) {  
    return {
            codigo      : codigo,
            juguete     : juguete,
            precio      : precio,
            cantidad    : cantidad
        };
},

altaJuguete: function () {
    let codigo       = document.getElementById('jug_codigo').value;
    let nombre   = document.getElementById('jug_nombre').value;
    let precio = document.getElementById('jug_precio').value;
    let cantidad     = document.getElementById('jug_cantidad').value;

    if (!this.validoDatosJug( nombre, precio, cantidad)) {
        alert("Error en agregar: debe completar todos los campos");
        return;
    }
    
    if (this.buscoJuguete(codigo) != -1) {
        alert("El código ingresado ya existe!");
        return;
    }
    
    let Juguete = this.crearJuguete(codigo, nombre, precio, cantidad);
    this.juguetes.push(Juguete);
    memoria.escribir('juguetes', this.juguetes);
    this.limpiarCajasJug();
    this.listarJuguetes();
},

altaVenta: function () {
    let codigo   = document.getElementById('ven_codigo').value;
    let articulo   = document.getElementById('ven_articulo').value;
    let cantidad = document.getElementById('ven_cantidad').value;
    let precio   = document.getElementById('ven_precio').value;

    if (!this.validoDatosJug(articulo, cantidad, precio)) {
        alert("Error en Venta: debe completar todos los campos");
        return;
    }

    if (this.buscoVenta(codigo) != -1) {
        alert("El código ingresado ya existe!");
        return;
    }
    
    let posicionJug = this.buscoJuguete(articulo);
    if (posicionJug === -1) {
        alert("El juguete ingresado no existe");
        return;
    }

    let objJuguete = this.juguetes[posicionJug];
    
    if (parseInt(objJuguete.cantidad) < parseInt(cantidad)) {
        alert("En este momento no tenemos la cantidad suficientes, podemos brindarle con los que contamos")
        return;
    }
    
    objJuguete.cantidad -= parseInt(cantidad);
    objJuguete.cantVentas += parseInt(cantidad);
    let objVenta = this.crearVenta(codigo, objJuguete, precio, cantidad);
    this.ventas.push(objVenta);
    memoria.escribir('ventas', this.ventas);
    memoria.escribir('juguetes', this.juguetes);
    
    this.limpiarCajasVen();
    this.listarVentas();
    this.listarJuguetes();
},

bajaJuguete: function () {
    let codigo  = document.getElementById('jug_lista').value;
    let pos = this.buscoJuguete(codigo);
    
    if (pos != -1) {
        this.juguetes.splice(pos,1);
        memoria.escribir('juguetes', this.juguetes);
        this.limpiarCajasJug();
        this.inicializar();
        this.listarVentas();
        this.listarJuguetes();
    }else {
        alert('Por favor seleccionar un juguete!');
    }
},

devolucion: function() {
    let codigoVenta = document.getElementById('ven_lista').value;
    let posVenta = this.buscoVenta(codigoVenta);

    if (posVenta !== -1) {
        let venta = this.ventas[posVenta];
        let codigoJuguete = venta.juguete.codigo;
        let posJuguete = this.buscoJuguete(codigoJuguete);

        if (posJuguete !== -1) {
            let jugueteDevuelto = this.juguetes[posJuguete];
            jugueteDevuelto.cantidad += parseInt(venta.cantidad);
            jugueteDevuelto.cantVentas -= parseInt(venta.cantidad);

            this.ventas.splice(posVenta, 1);
            memoria.escribir('ventas', this.ventas);
            memoria.escribir('juguetes', this.juguetes);

            this.inicializar();
            this.listarVentas();
            this.limpiarCajasVen();

        } else {
            alert('El juguete asociado a esta venta no se encuentra en el inventario.');
        }
    } else {
        alert('Por favor seleccionar una venta!');
    }
},

listarJuguetes: function () {
        let lista = document.getElementById('jug_lista').options;
        lista.length = 0;
        
        for (let Juguete of this.juguetes) {
            let texto = Juguete.codigo + ': ' + Juguete.nombre + ' - $' + 
                        Juguete.precio+ ' - ' + Juguete.cantidad+' unidades';
            
            let elemento = new Option(texto, Juguete.codigo);
            lista.add(elemento);
        }
        
    },

listarVentas: function () {
    let lista = document.getElementById('ven_lista').options;
    lista.length = 0;
    console.log(this.ventas);
    for (let objVenta of this.ventas) {
        let texto = objVenta.codigo + ': ' + objVenta.juguete.nombre + ' - ' + 
        objVenta.cantidad+ ' - $' + objVenta.precio;
        
        let elemento = new Option(texto, objVenta.codigo);
        lista.add(elemento);
    }
},

seleccionarJuguete: function(){
    let numero = document.getElementById('jug_lista').value;
    for (let Juguete of this.juguetes) {
        if(numero == Juguete.codigo){
            document.getElementById('jug_codigo').value = Juguete.codigo;
            document.getElementById('jug_nombre').value = Juguete.nombre;
            document.getElementById('jug_precio').value = Juguete.precio;
            document.getElementById('jug_cantidad').value = Juguete.cantidad;
            break;
        }
    }
},

seleccionarVenta: function(){
    let numero = document.getElementById('ven_lista').value;
    for (let objVenta of this.ventas) {
        if(numero == objVenta.codigo){
            document.getElementById('ven_codigo').value = objVenta.codigo;
            document.getElementById('ven_articulo').value = objVenta.juguete.codigo;
            document.getElementById('ven_articulo_nombre').value = objVenta.juguete.nombre;
            document.getElementById('ven_cantidad').value = objVenta.cantidad;
            document.getElementById('ven_precio').value = objVenta.precio;
            break;
        }
    }
},

limpiarCajasJug: function(){
    document.getElementById("miFormJug").reset();    
},

limpiarCajasVen: function(){
    document.getElementById("miFormVen").reset();    
},

buscoJuguete: function (codigo) {
    for (let pos = 0; pos < this.juguetes.length; pos++) {
        if (this.juguetes[pos].codigo === codigo) {
            return pos;
        }
    }
    return -1;
},

buscoVenta: function (codigo) {
    for (let pos = 0; pos < this.ventas.length; pos++) {
        if (this.ventas[pos].codigo === codigo) {
            return (pos);
        }
    }
    return -1;
},

cargoJuguete: function () {
    let codigo = document.getElementById("ven_articulo").value;
    for (let pos = 0; pos < this.juguetes.length; pos++) {
        if (this.juguetes[pos].codigo == codigo) {
            document.getElementById("ven_articulo_nombre").value = this.juguetes[pos].nombre;
        }
    }
},

cargoPrecioJuguete: function () {
    let codigo = document.getElementById("ven_articulo").value;
    let cantidad = document.getElementById("ven_cantidad").value;
    for (let pos = 0; pos < this.juguetes.length; pos++) {
        if (this.juguetes[pos].codigo == codigo) {
            document.getElementById("ven_precio").value = this.juguetes[pos].precio * cantidad;
        }
    }
},


modificarJuguete: function () {
    let codigoSeleccionado  = document.getElementById('jug_lista').value;
    let pos = this.buscoJuguete(codigoSeleccionado);
    if (pos != -1) {
        let nombre      = document.getElementById('jug_nombre').value;
        let precio      = document.getElementById('jug_precio').value;
        let cantidad    = document.getElementById('jug_cantidad').value;

        if (!this.validoDatosJug(nombre, precio, cantidad)) {
            alert('Error en modificar: debe ingresar todos los campos.');    
            return;
        }
        
        this.juguetes[pos].nombre = nombre;
        this.juguetes[pos].precio = precio;
        this.juguetes[pos].cantidad = cantidad;
        memoria.escribir('juguetes', this.juguetes);
        this.inicializar();
        }else{
            alert("Debe seleccionar un juguete!!")
        } 
 },

 validoDatosJug: function(nombre,precio,cantidad){
    if (nombre == "" || precio == "" || cantidad == "") {
        return false;
    }
    return true;
 },

 validoDatosVen: function(juguete,precio,cantidad){
    if (juguete == "" || precio == "" || cantidad == "") {
        return false;
    }
    return true;
 },

 listarJugueteMasVendido: function () {
    
    let JugueteMasVendido = 0;
    let JugueteMasVendidoReal;
    for (let objJuguete of this.juguetes) {
        if(objJuguete.cantVentas > JugueteMasVendido){    
            JugueteMasVendido = objJuguete.cantVentas;
            JugueteMasVendidoReal = objJuguete;
        }
    }
    document.getElementById('JugueteMasVendido').value = JugueteMasVendidoReal.nombre;
    document.getElementById('JugueteMasVendido2').innerHTML = JugueteMasVendidoReal.nombre;
},

listarJugueteConStock: function () {
    
    let texto = "";
    
    for (let objJuguete of this.juguetes) {
        if(objJuguete.cantidad > 0){    
            texto+= objJuguete.nombre + " con " + objJuguete.cantidad + " unidades <br>";
        }
    }
    
    document.getElementById('JuguetesConStock').innerHTML = texto;
},

calcularTotalRecaudado: function () {
    let total = 0;
    for (let objVenta of this.ventas) {
        total += parseInt(objVenta.precio );
    }
    this.totalRecaudado = total;

    document.getElementById('totalRecaudado').value = '  $' + total;
    document.getElementById('totalRecaudado2').innerHTML = '  $' + total;

},
}