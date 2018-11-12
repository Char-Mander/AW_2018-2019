"use strict";

const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
}); 


const DAOUsers = require("./DAOUsers.js");
const DAOTasks = require("./DAOTasks.js")

//--------------------------------------FUNCIONES CALLBACK DEL USUARIO-------------------------------------------
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
        console.log(`El fichero donde se encuentra la imagen de perfil es `  + `${result[0].img}`);
    }
}

const daoUsers = new DAOUsers(pool);

//--------------------------------------FUNCIONES CALLBACK DE LAS TAREAS-------------------------------------------
function cb_getAllTasks(error, tareas){
     if(error)
        console.log(`${error.message}`);
    else{
        console.log("Las tareas del usuario son:");
        
        for(let t = 0; t < tareas.length; t++){
            console.log("ID: " + tareas[t].id + "\nTexto: " + tareas[t].text);
            let etiquetas = "";
            for(let e = 0; e < tareas[t].tags.length; e++){
                etiquetas += tareas[t].tags[e] + " ";
            }

            console.log("Etiquetas: " + etiquetas + "\n");
        }
    }
}

function cb_insertarTask(error){
    if(error)
        console.log(`${error.message}`);
    else
        console.log("Inserción realizada con éxito");
}

function cb_markTaskDone(error){
    if(error)
        console.log(`${error.message}`);
    else
        console.log("Tarea marcada como completada");
}

function cb_deleteCompleted(error){
    if(error)
        console.log(`${error.message}`);
    else
        console.log("Tareas completadas borradas");

}

const daoTasks = new DAOTasks(pool);