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
        console.log(err.message);
    }
    else if(result){
        console.log("Usuario y contraseña correctos");
    }
    else{
        console.log("Usuario y/o contraseña incorrectos");
    }
}

function cb_getUserImageName(err, result){
    if(err){
        console.log(err.message);
    }
    else if(result==null){
        console.log(`No existe el usuario`);
    }
    else{
        console.log(`El fichero donde se encuentra la imagen de perfil es `  + `${result}`);
    }
}


const DAOUsers=require("./DAOUsers.js");
const DAOTasks=require("./DAOTasks.js")