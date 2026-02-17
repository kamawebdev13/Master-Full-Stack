const products = [
    { name: "Laptop", price: 850, stock: 15 },
    { name: "Mouse", price: 25, stock: 50 },
    { name: "Teclado", price: 45, stock: 20 }
];


const addCart = (productName, quantity) => {
    // Buscamos el producto
    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase()
    );
    if (!product) {
        return console.log(`${productName} no encontrado intente de nuevo`)
    }
      // Verificamos si hay stock suficiente
    if (quantity > product.stock) {
        return console.log(`No hay stock suficiente del siguiente producto: ${productName}`)
    }
    // calculamos el total de la compra
    let total = product.price * quantity;

    console.log(`El total de su compra es la sig: ${quantity}  del producto: ${productName}`)

     // actualizamos el inventario
    product.stock -= quantity;

    console.log(`Del inventario del producto: ${product.name} queda la cantidad de ${product.stock}`);

    if (product.stock === 0) {
        return console.log(`Alerta el siguiente producto: ${product.name} se ha agotado`)
    }



}

addCart("Mouse", 50)

console.log(products);