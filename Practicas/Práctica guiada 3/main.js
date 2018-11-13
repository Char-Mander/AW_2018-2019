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

let usr = "paco@gmail.com";
let passwrd = "12345";

let usr2 = "mario@ucm.es";
let passwrd2 = "zanahoria";

let usr3 = "marta@ucm.es";
let passwrd3 = "45amapola45";
/*
daoUsers.isUserCorrect(usr, passwrd, cb_isUserCorrect); //correcto
daoUsers.isUserCorrect(usr2, passwrd2, cb_isUserCorrect);   //correcto
daoUsers.isUserCorrect(usr3, passwrd3, cb_isUserCorrect);   //correcto
daoUsers.isUserCorrect("marina@ucm.es", "zapatillas", cb_isUserCorrect);    //incorrecto

daoUsers.getUserImageName(usr, cb_getUserImageName);    //correcto
daoUsers.getUserImageName(usr2, cb_getUserImageName);   //correcto
daoUsers.getUserImageName(usr3, cb_getUserImageName);   //correcto
daoUsers.getUserImageName("marina@ucm.es", cb_getUserImageName);    //incorrecto
*/
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

let tareas = [
    {   id: 1,
        text: "Hacer la práctica de AW",
        done: 0,
        tags: ["Universidad", "Aw"] 
    },
    {
        id: 2,
        text: "Reservar cancha para el partido",
        done: 0,
        tags: ["Deporte"]
    },
    {
        id: 3,
        text: "Comprar cerveza para la fiesta",
        done: 0,
        tags: ["Fiesta", "Amigos"]
    },
    {
        id: 4,
        text: "Comprar entradas para los Celtis",
        done: 1,
        tags: ["Basket", "Celtics"]
    },
    {
        id: 5,
        text: "Recoger el cuarto",
        done: 0,
        tags: []
    }]

//daoTasks.insertTask(usr, tareas[0], cb_insertarTask);
daoTasks.getAllTasks("javier@gmail.com", cb_getAllTasks);
/*daoTasks.insertTask(usr, tareas[1], cb_insertarTask);
daoTasks.insertTask(usr2, tareas[3], cb_insertarTask);
daoTasks.insertTask(usr, tareas[4], cb_insertarTask);

daoTasks.getAllTasks(usr, cb_getAllTasks); 

daoTasks.insertTask(usr, tareas[2], cb_insertarTask);
daoTasks.getAllTasks(usr, cb_getAllTasks);
daoTasks.getAllTasks(usr2, cb_getAllTasks);
daoTasks.getAllTasks(usr3, cb_getAllTasks);
daoTasks.markTaskDone(1, cb_markTaskDone);
daoTasks.deleteCompleted(usr, cb_deleteCompleted);
*/
//daoTasks.terminarConexion();
//daoUsers.terminarConexion();