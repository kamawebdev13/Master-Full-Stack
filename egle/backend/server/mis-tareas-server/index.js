const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Tareas por hacer hoy!!!')

});

//definimos el array con las tareas
const tareas =
    [
        { id: 1, name: "hacer la colada" },
        { id: 2, name: "pasar aspiradora" },
        { id: 3, name: "limpiar el baño" },
        { id: 4, name: "planchar" }
    ]

app.get('/tareas', (req, res) => {
    res.json(tareas);
});

app.get('/tareas/:id', (req, res) => {
    // Buscamos la tarea que coincida con el ID de la URL
    const tareasId = parseInt(req.params.id);

    const tarea = tareas.find(t => t.id === tareasId);


    if (!tarea) {
        return res.status(404).send(`Lo sentimos, este ID de tarea: ${tareasId} no existe.`);
    }

    res.json(`La siguiente tarea por hacer es: ${tarea.name}`);


});
// crear nueva tarea
app.post('/tareas', (req, res) => {

    const nuevaTarea = {
        id: tareas.length + 1,
        name: req.body.name

    };

    tareas.push(nuevaTarea)
    res.status(201).json(nuevaTarea);



});

// agregar tareas manteniendo el id

app.post('/tareas', (req, res) => {
    if (!req.body.name) {
        return res.status(400).send(`Falta el nombre de la tarea.`);

    }

    const nuevaTareaId = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1;

    const nuevaTarea = {
        id: nuevaTareaId,
        name: req.body.name

    };

    tareas.push(nuevaTarea)
    res.status(201).json(nuevaTarea);


})


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en http://127.0.0.1:${PORT}`);
});
