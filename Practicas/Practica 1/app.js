"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config.js");
const middlewares = require("./middlewares.js"); 
const expressValidator = require("express-validator");
const users = require("./users/user.js");
const amigos = require("./amigos/amigos.js");

//  Creación de una aplicación express
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));


//  Configuración de fichero estáticos
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

//  Middlewares
app.use(bodyParser.urlencoded({ extended: true })); //body-parser
app.use(middlewares.middlewareSession); //express-mysql-session

//  Uso del validator
app.use(expressValidator());

app.use("/users", users);   //Manejadores de ruta de usuarios
app.use("/amigos", amigos); //Manejadores de ruta de amigos y solicitudes


//  Arranque del servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
