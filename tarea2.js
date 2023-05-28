/*
En el archivo tarea2.js podemos encontrar un código de un supermercado que vende productos.
El código contiene 
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades      ||      COMPLETADO
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.      ||      COMPLETADO (Nose si lo hice de la manera correcta).
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.      ||      COMPLETADO
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)      ||      COMPLETADO 
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto      ||      COMPLETADO 
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito      ||      COMPLETADO 
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error      ||      COMPLETADO 
    e) La función debe retornar una promesa      ||      COMPLETADO 
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);
    
        try {
            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);
            const productoEnCarrito = this.productos.find(productoPorSku => productoPorSku.sku === producto.sku); // Checkear si ya existe el producto en el carrito.
            const categoriaEcontrada = this.categorias.find(categoria => categoria === producto.categoria); // Checkear si ya existe la categoria del producto en el carrtio.

            if(!productosDelSuper.includes(producto)) {                                 // Nunca se va a ejecutar este error, ya que el error lo da en "findProductBySku",
                throw new Error("No existe el producto con el sku: " + producto.sku);   // pero queria hacerlo igual para resolver la consigna. Igualmente nose si es la solución correcta.
            }

            if(productoEnCarrito) { // Si ya existe el producto que queremos, agregar solo la cantidad que el usuario quiere.
                console.log("Ya existe este producto en el carrito, modificando la cantidad...");
                productoEnCarrito.cantidad += cantidad; // Actualizamos la cantidad.
                this.precioTotal += (producto.precio * cantidad); // Actualizamos el precio.
                console.log("Se actualizó el carrito: " + producto.nombre + ". El precio total es de: " + this.precioTotal);
            } else { // Si no existe, creo un producto nuevo.
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);
                this.precioTotal += (producto.precio * cantidad);
                console.log("Nuevo producto agregado al carrito: " + producto.nombre + ". El precio total es de: " + this.precioTotal);
            }

            if(!categoriaEcontrada) { // Si aún no existe la categoria del producto en el carrito, agregarla.
                this.categorias.push(producto.categoria);
            }
        } catch(error) {
            console.error(error);
        }
    }

    async eliminarProducto(sku, cantidad) {
        try {
            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);
            const productoEnCarrito = this.productos.find(productoPorSku => productoPorSku.sku === producto.sku); // Checkear si ya existe el producto en el carrito.

            return new Promise((resolve, reject) => {
                console.log("En el carrito hay: " + productoEnCarrito.cantidad + " unidades de " + productoEnCarrito.nombre);

                if(cantidad < productoEnCarrito.cantidad) { // Si la cantidad que queremos quitar es menor a la cantidad del producto que hay en el array, quitar esa cantidad.
                    this.precioTotal -= (producto.precio * cantidad);
                    resolve(productoEnCarrito.cantidad -= cantidad);
                } else if(cantidad >= productoEnCarrito.cantidad) { // Si la cantidad que queremos quitar es mayor o igual a la cantidad del producto que hay en el array, eliminar el producto del array.
                    this.precioTotal -= (producto.precio * productoEnCarrito.cantidad);
                    const indexProducto = this.productos.indexOf(productoEnCarrito); // Conseguimos el indice del producto que queremos borrar.
                    resolve(this.productos.splice(indexProducto, 1)); // Eliminamos el producto del array
                } else if(!productoEnCarrito) { // Si no existe el producto en el carrito, mostrar error.
                    reject("El producto: " + producto.nombre + " no existe en el carrito.");
                }
            });
        } catch(error) {
            console.error(error);
        }
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

    mostrarCantidad() { 
        console.log("El producto: " + this.nombre + ", tiene una cantidad de " + this.cantidad);
    }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}

const carrito = new Carrito();
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 4);
carrito.agregarProducto('RT324GD', 3);
carrito.agregarProducto('RT364GD', 3);

carrito.eliminarProducto('WE328NJ', 3)
    .then(() => {
        console.log('Se eliminó el producto, el nuevo precio total es de: ' + carrito.precioTotal);
    })
    .catch((error) => { 
        console.error('No se pudo eliminar el producto', error);
    });