let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function agregarCarrito(nombre, precio){

let producto = carrito.find(p => p.nombre === nombre);

if(producto){
producto.cantidad++;
}else{
carrito.push({nombre, precio, cantidad:1});
}

localStorage.setItem("carrito", JSON.stringify(carrito));

alert("Producto agregado al carrito 🛒");

}


function mostrarCarrito(){

let tabla = document.getElementById("tablaCarrito");

if(!tabla) return;

tabla.innerHTML="";

let total = 0;

carrito.forEach((producto, index)=>{

let fila = document.createElement("tr");

fila.innerHTML = `
<td>${producto.nombre}</td>
<td>$${producto.precio}</td>
<td>${producto.cantidad}</td>
<td><button onclick="eliminarProducto(${index})">❌</button></td>
`;

tabla.appendChild(fila);

total += producto.precio * producto.cantidad;

});

let totalElemento = document.getElementById("total");
if(totalElemento){
totalElemento.textContent = "Total: $" + total;
}

}


function eliminarProducto(index){

carrito.splice(index,1);

localStorage.setItem("carrito", JSON.stringify(carrito));

mostrarCarrito();

}

function vaciarCarrito(){

localStorage.removeItem("carrito");

carrito=[];

mostrarCarrito();

}


function buscarProducto(){

let input = document.getElementById("buscador").value.toLowerCase();

let productos = document.querySelectorAll(".producto");

productos.forEach(producto=>{

let texto = producto.innerText.toLowerCase();

producto.style.display = texto.includes(input) ? "block" : "none";

});

}

document.addEventListener("DOMContentLoaded", () => {

mostrarCarrito();

let carrusel = document.querySelector('#carouselExample');

if(carrusel){
new bootstrap.Carousel(carrusel, {
interval: 2500,
ride: 'carousel',
pause: false,
wrap: true
});
}

});


function finalizarCompra() {

    if (carrito.length === 0) {
      alert("El carrito está vacío ❌");
      return;
    }
  
    fetch("http://localhost:3000/pedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productos: carrito,
        total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
      })
    })
    .then(res => res.json())
    .then(data => {
      alert("Pedido enviado correctamente ✅");
      vaciarCarrito();
    })
    .catch(error => {
      console.error(error);
      alert("Error conectando con el servidor ❌");
    });
  }