"use strict";

const express = require("express");
const mysql = require("mysql");
const DAOUsers = require("../users/DAOUsers.js");
const config = require("../config");
const middlewares = require("../middlewares.js");
const DAOAmigos = require("./DAOAmigos.js");

const amigos = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

const daoAmigos = new DAOAmigos(pool);
const daoUsers = new DAOUsers(pool);

//VENTANA DEL LISTADO DE PETICIONES DE AMISTAD Y AMIGOS DE UN USUARIO
amigos.get("/mis_amigos", middlewares.middlewareLogin, function (request, response) {

    //Sacamos la lista de peticiones
    daoAmigos.getPeticiones(response.locals.userId, function (error, listaPeticiones) {
        if (error) {
            response.status(500);
        }
        else {
            //Sacamos la lista de amigos
            daoAmigos.getAmigos(response.locals.userId, function (error, listaAmigos) {
                if (error) {
                    response.status(500);
                    console.log("Error en el getAmigos");
                }
                else {
                    response.status(200);
                    let usuario = {};
                            usuario.puntos = response.locals.userPoints;
                            usuario.id = response.locals.userId;
                            usuario.img = response.locals.userImg;
                            response.render("mis_amigos", { gosMsg: "¡No tienes ningún amigo todavía!",
                            sinSolicitudesMsg: "No tienes ninguna solicitud pendiente",
                            amigos:  listaAmigos, user: usuario, peticiones: listaPeticiones });
                }
            });
        }
    });
});

//  Búsqueda de amigos del usuario
amigos.get("/busqueda_amigos", function (request, response) {
    response.status(200);
    response.redirect("/amigos/mis_amigos");
});

amigos.post("/busqueda_amigos", middlewares.middlewareLogin, function (request, response) {
    let name = request.body.name_user;//Coge el nombre como undefined (probablemente por la redirección)
    console.log(name);
    //Sacamos el id de los usuarios cuyo nombre se parece al que el usuario de la sesión ha escritos
    daoAmigos.buscarAmigos(response.locals.userId, name, function (error, users) {
        if (error) {
            response.status(500);
            console.log(error.message);
        } else {
            response.status(200);
            let usuario=[];
            usuario.puntos = response.locals.userPoints;
            usuario.id = response.locals.userId;
            usuario.img = response.locals.userImg;
            response.render("busqueda_amigos",{noFoundMsg: "No se ha encontrado a ningún usuario", 
            amigos: users, user: usuario, name: name});
                       
        }
    });



});


module.exports = amigos;