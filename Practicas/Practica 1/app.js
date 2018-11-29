"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config.js");
const middlewares = require("./middlewares.js"); 
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

//middelware del login, comprueba que esté en la sesión del usuario
app.use(middlewares.middlewareLogin);

app.use("/users", users);
app.use("/amigos", amigos);

//  Arranque del servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
