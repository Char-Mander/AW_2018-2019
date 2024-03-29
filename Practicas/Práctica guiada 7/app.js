"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config");

// Crear un servidor Express.js
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));


//  Ficheros estáticos
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

app.use(bodyParser.json());


//array de tareas iniciales
let tasks = [
    {
        id: 1,
        text: "Comprar billetes de avión"
    },
    {
        id: 2,
        text: "Hacer las maletas"
    },
    {
        id: 3,
        text: "Comprar regalos de reyes"
    },
    {
        id: 4,
        text: "Reservar coche"
    }
];

//Guarda el próximo id de la tarea insertada
let idCounter = 5;

// Arrancar el servidor
app.listen(config.port, function(err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
 });


 //Si no se pone nada, redirige a /tasks
app.get("/", function(request, response){
    response.status(200);
    response.redirect("/tasks");
});


// Servicio 1: Devolver todas las entradas contenidas en la lista de tareas:
// Método: GET
// URL: /tasks
// Parámetros de entrada: Ninguno
// Códigos de respuesta: 200 (OK)
// Tipo de resultado: JSON
// Resultado: Array con las tareas de la lista. Cada tarea es un objeto con dos atributos: id y text.
//Muestra todas las tareas
app.get("/tasks", function(request, response){
    response.status(200);
    response.json(tasks);
    response.end();
});


// Servicio 2: Añadir una nueva entrada a la lista de tareas.
// Método: POST
// URL: /tasks
// Parámetros de entrada: Un objeto JSON con un único atributo (text), que contendrá el texto de la tarea a insertar.
// Códigos de respuesta: 200 (OK)
// Tipo de resultado: JSON
// Resultado: Objeto tarea insertado, con dos atributos: id y text. El identificador de la tarea será generado automáticamente por el servidor. 
// El texto será el mismo que el especificado en el parámetro de entrada.
//Añade una tarea nueva al array
app.post("/tasks", function(request, response){
    let newTask = {};

    newTask.id = idCounter;
    idCounter++;
    newTask.text = request.body;
    tasks.push(newTask);
    //response.json({data : newTask});
    response.status(200);
    response.end();
    
});


// Servicio 3: Eliminar una entrada a la lista de tareas.
// Método: DELETE
// URL paramétrica: /tasks/:id
// Parámetros de entrada: El parámetro :id de la URL paramétrica contiene el identificador de la tarea a eliminar.
// Códigos de respuesta: 200 (OK) si el :id indicado es un número, 404 (Not found) si no existe el elemento, 
// o 400 (Bad request) si el :id indicado no es un número.
// Tipos de resultado: JSON
// Resultado: Un objeto vacío {}.
app.delete("/tasks/:id", function(request, response){
    let id = Number(request.params.id);

    if(!tasks.some(n => n.id === id))
        response.status(404);

    else if(isNaN(id))
        response.status(400);

    else{
        tasks.forEach((v,i,a) => {
            if(id === v.id){
                tasks.splice(i, 1);
            }
        });
        response.status(200);
    }

    response.end();
});