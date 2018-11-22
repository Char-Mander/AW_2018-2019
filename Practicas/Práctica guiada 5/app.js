"use strict";
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const createTask = require("./P0.js");
const mysqlSession = require("express-mysql-session");
const session = require("express-session");
const MySQLStore = mysqlSession(session);

// Crear un servidor Express.js
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));



//MYSQL SESSION
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
});

//Crear el middlewareSession
const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
app.use(middlewareSession);

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks y de DAOUsers
const daoT = new DAOTasks(pool);
const daoU = new DAOUsers(pool);

//  Ficheros estáticos

const ficherosEstaticos = path.join(__dirname, "public");

app.use(express.static(ficherosEstaticos));


//  Listado de tareas
app.get("/tasks", function (request, response) {
    daoT.getAllTasks("usuario@ucm.es", function (error, tareas) {
        if (error) {
            response.status(500);
        }
        else {
            response.status(200);
            response.render("tasks", { taskList: tareas });
        }
    });

});


app.use(bodyParser.urlencoded({ extended: true }));

//  Añadir la tarea a la lista de tareas
app.post("/addTask", function (request, response) {
    let cuerpo = request.body.Tarea_añadida;
    let task = createTask(cuerpo);


    daoT.insertTask("usuario@ucm.es", task, function (error) {
        if (error) {
            if (error.message === "Empty task") {
                response.status(200);
                response.redirect("/tasks");
            }
            else {
                response.status(500);
            }
        }
        else {
            response.status(200);
            response.redirect("/tasks");
        }
    });
});


//Función del login del usuario
app.post("/login", function (request, response) {
       response.status(500);
        //reiniciar el proceso de login
        //response.redirect("/login");

        response.status(200);
        let user={
            email: "",
            password: ""
        }
        user.email = request.body.email_user;
        user.password = request.body.password_user;
        
        daoU.isUserCorrect(user.email, user.password, function(error, res){
            if(error){
                response.render("login", {errorMsg : "Error"});
            }
            else if(res){
                request.session.currentUser=user.email;
                response.redirect("/tasks");
            }
            else{
                
                response.render("login", {errorMsg : "Usuario y/o contraseña incorrectos"});
            }
        });
});


app.get("/login", function(request, response){
        response.status(200);
        response.render("login", {errorMsg : null});
})

//  Marcar tarea como finalizada
app.get("/finish/:taskId", function (request, response) {
    daoT.markTaskDone(request.params.taskId, function (error) {
        if (error) {
            response.status(500);
        }
        else {
            response.status(200);
            response.redirect("/tasks");
        }
    });
});


//  Eliminar tareas marcadas
app.get("/deleteCompleted", function (request, response) {
    daoT.deleteCompleted("usuario@ucm.es", function (error) {
        if (error) {
            response.status(500);
        }
        else {
            response.status(200);
            response.redirect("/tasks");
        }
    });
});


// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});