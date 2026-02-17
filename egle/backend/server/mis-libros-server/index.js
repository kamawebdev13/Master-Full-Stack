const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {

    res.send("Bienvenidos a mi biblioteca!!!")
})
// Definimos array de libros
const libros = [
    {
        id: 1,
        titulo: "Harry Potter y la piedra filosofal",
        autor: "J.K. Rowlling",
        paginas: 256
    }
];

app.get('/libros', (req, res) => {
    res.json(libros)

});

// buscamos el libro por su ID

app.get('/libros/:id'), (req, res) => {

    const libroId = parseInt(req.params.id);

    const libro = libros.find(l => l.id === libroId);

    if(!libro) {
         return res.status(404).send(`Lo sentimos, este ID: ${libroId} no existe. 
            Intente de nuevo`);

    }

    res.json(`El libro solicitado es: ${libro.titulo}`)

}

//agregamos un nuevo libro
app.post('/libros', (req, res) => {

    const nuevoLibro = {
        id: libros.length + 1,
        titulo: req.body.titulo,
        autor: req.body.autor

    };

    libros.push(nuevoLibro)
    res.status(201).json(nuevoLibro);
})


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en http://127.0.0.1:${PORT}`);
});
