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
    daoAmigos.getPeticiones(response.locals.userId, function (error, peticiones) {
        if (error) {
            response.status(500);
        }
        else {
            let arrayPeticiones = [];
            //Array que permite sacar el nombre de los users que han enviado petición de amistad
            for (let i = 0; peticiones !== undefined && i < peticiones.length; i++) {

                daoUsers.getUser(peticiones[i].action_id_user, function (error, user) {
                    if (error) {
                        response.status(500);
                    } else {
                        response.status(200);
                        arrayPeticiones.push(peticiones[i]);
                        arrayPeticiones[i].nombre_completo = user.nombre_completo;
                    }
                });
            }
            //Sacamos la lista de amigos
            daoAmigos.getAmigos(response.locals.userId, function (error, listaAmigos) {
                if (error) {
                    response.status(500);
                }
                else {
                    let arrayAmigos = [];
                    let sacar_amigo;

                    //Array que permite sacar el nombre de cada uno de los users que están en la lista de amigos
                    for (let i = 0; listaAmigos !== undefined && i < listaAmigos.length; i++) {

                        if (response.locals.userId == listaAmigos[i].id_user1)
                            sacar_amigo = listaAmigos[i].id_user2;
                        else
                            sacar_amigo = listaAmigos[i].id_user1;

                        daoUsers.getUser(sacar_amigo, function (error, user) {
                            if (error) {
                                response.status(500);
                            } else {
                                response.status(200);
                                arrayAmigos.push(listaAmigos[i]);
                                arrayAmigos[i].nombre_completo = user.nombre_completo;
                                response.render("mis_amigos", { amigos: arrayAmigos, puntos: response.locals.userPoints, peticiones: arrayPeticiones });
                            }
                        });
                    }
                }
            });
        }
    });
});

//  Búsqueda de amigos del usuario
amigos.get("/busqueda_amigos", middlewares.middlewareLogin, function (request, response) {
    response.status(200);
    response.render("busqueda", { errorMsg: null, puntos: response.locals.userPoints});
});

amigos.post("/busqueda_amigos", middlewares.middlewareLogin, function (request, response) {
    let name = request.body.name_user;
    //Sacamos el id de los usuarios cuyo nombre se parece al que el usuario de la sesión ha escritos
    daoAmigos.buscarAmigos(name, function (error, users) {
        if (error) {
            response.status(500);
        } else {
            response.status(200);

            daoAmigos.getAmigos(response.locals.userId, function (error, amigos) {
                if (error) {
                    response.status(500);
                } else {
                    response.status(200);

                    daoAmigos.getPeticiones(response.locals.userId, function (error, peticiones) {
                        if (error) {
                            response.status(500);
                        } else {
                            response.status(200);
                            users.filter(n => n.id_user != response.locals.userId && amigos.every(f => f.id_user1 =! n.id_user && f.id_user2 != n.id_user) 
                            && peticiones.every(p => p.id_user1 =! n.id_user && p.id_user2 != n.id_user));
                            console.log(users); 
                            response.render("busqueda", { amigos: users, puntos: response.locals.userPoints });
                        }
                    });
                }
            });
        }
    });



});


module.exports = amigos;