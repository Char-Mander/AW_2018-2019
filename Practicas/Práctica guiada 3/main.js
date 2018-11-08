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

function cb_getAllTasks(error, tareas){
    if(error)
        console.log(`${error.message}`);
    else
        console.log("Las tareas a realizar son:\n");
        
        for(let t = 0; t < tareas.length; t++){
            console.log("ID: " + tareas[t].id + "\nTexto: " + tareas[t].text + "\nEtiquetas:\n");
            for(let e = 0; e < tareas[t].tags.length; e++){
                console.log("\t" + tareas[t].tags[e] + "\n");
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


const DAOUsers=require("./DAOUsers.js");
const DAOTasks=require("./DAOTasks.js")