"use strict";
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);

//  Ficheros estáticos
const ficherosEstaticos =path.join(__dirname, "public");

app.use(express.static(ficherosEstaticos));

//  Listado de tareas
app.get("/tasks", function(request, response){
    daoT.getAllTasks("usuario@ucm.es", function(error, tareas){
        if(error){
            response.status(500);
        }
        else{
            response.status(200);
            response.render("tasks", {taskList: tareas}); 
        }
    });
   
});

app.use(bodyParser.urlencoded({ extended : true }));

//  Añadir la tarea a la lista de tareas
app.post("/addTask", function(request, response){
    //se añade la tarea a la base de datos  

    let cuerpo = [];
    cuerpo.push(request.body.Tarea_añadida);
    var task = sacarTarea(cuerpo);

    daoT.insertTask("usuario@ucm.es", function(error, task){
        if(error){
            response.status(500);
        }
        else{
            response.status(200);
            response.redirect("/tasks");
        }
    });
   
});


//  Marcar tarea como finalizada
app.get("/finish/:taskId", function(request, response){
    daoT.markTaskDone(request.params.taskId, function(error){
        if(error){
            response.status(500);
        }
        else{
            response.status(200);
            response.redirect("/tasks");
        }
    });
});


//  Eliminar tareas marcadas
app.get("/deleteCompleted", function(request, response){
    daoT.deleteCompleted("usuario@ucm.es", function(error){
        if(error){
            response.status(500);
        }
        else{
            response.status(200);
            response.redirect("/tasks");
        }
    });
});


// Arrancar el servidor
app.listen(config.port, function(err) {
   if (err) {
       console.log("ERROR al iniciar el servidor");
   }
   else {
       console.log(`Servidor arrancado en el puerto ${config.port}`);
   }
});


//Sirve para parsear las tareas que se añaden
function sacarTarea(cuerpo){
    let tarea=[{
        id: "",
        texto: "",
        done: 0,
        tags: [] 
    }];
    cuerpo[0].split(" ");
    tarea.texto = cuerpo[0].filter(n => !n.startsWith("@") && n !== "").join(" ").trim();
    tarea.tags = cuerpo[0].filter(n => n.startsWith("@"));
    tarea.tags = tarea.tags.map(t => t.slice(1, t.length));

    return tarea;
}