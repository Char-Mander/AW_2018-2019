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
                            response.render("mis_amigos", { sinAmigosMsg: "¡No tienes ningún amigo todavía!",
                            sinSolicitudesMsg: "No tienes ninguna solicitud pendiente",
                            amigos:  listaAmigos, user: usuario, peticiones: listaPeticiones });
                }
            });
        }
    });
});

//  Búsqueda de amigos del usuario
amigos.get("/busqueda_amigos", middlewares.middlewareLogin, function (request, response) {
    response.status(200);
    response.render("busqueda_amigos", { errorMsg: null, puntos: response.locals.userPoints });
});

amigos.post("/busqueda_amigos", function (request, response) {
    let name = request.body.name_user;//Coge el nombre como undefined (probablemente por la redirección)

    console.log(name);
    //Sacamos el id de los usuarios cuyo nombre se parece al que el usuario de la sesión ha escritos
    daoAmigos.buscarAmigos(name, function (error, users) {
        if (error) {
            response.status(500);
            console.log(error.message);
        } else {
            response.status(200);
            console.log("Busca a los amigos");
            //Se sacan los id de la lista de usuarios que son amigos
            daoAmigos.getAmigos(response.locals.userId, function (error, amigos) {
                if (error) {
                    response.status(500);
                    console.log(error.message);
                } else {
                    response.status(200);
                    console.log("Get amigos");
                    console.log(amigos);
                    //Se sacan los id de las peticiones de amistad que hay de unos usuarios a otros
                    daoAmigos.getPeticiones(response.locals.userId, function (error, peticiones) {
                        if (error) {
                            response.status(500);
                            console.log(error.message);
                        } else {
                            response.status(200);
                            console.log("Get peticiones");
                            console.log(peticiones);
                            //Se quita de la lista de usuarios el propio usuario, los que son amigos, y los que tienen una petición de amistad pendiente
                            users.filter(n => n.id_user != response.locals.userId && amigos.every(f => f.id_user1 = !n.id_user && f.id_user2 != n.id_user)
                                && peticiones.every(p => p.id_user1 = !n.id_user && p.id_user2 != n.id_user));
                            console.log("Resultado final:");
                            console.log(users);
                            response.redirect("/amigos/busqueda_amigos", {
                                errorMsg: "No se ha encontrado a ningún usuario", amigos: users, puntos: response.locals.userPoints, name: name
                            });
                        }
                    });
                }
            });
        }
    });



});


module.exports = amigos;