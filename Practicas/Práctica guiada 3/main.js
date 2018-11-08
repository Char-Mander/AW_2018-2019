"use strict";

const mysql = require("mysql");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "gestor_tareas"
}); 

function cb_isUserCorrect(err, result){
    if(err){
        console.log("Error de conexión a la base de datos");
    }
    else if(result){
        console.log("Usuario y  contraseña correctos");
    }
    else{
        console.log("Usuario y/o contraseña incorrectos");
    }
}


const DAOUsers=require("./DAOUsers.js");
const DAOTasks=require("./DAOTasks.js")