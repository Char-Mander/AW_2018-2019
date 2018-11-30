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
    daoAmigos.getPeticiones(response.locals.userId, function (error, peticiones){
        if (error) {
            response.status(500);
        }
        else {
            let arrayPeticiones = [];
            //Array que permite sacar el nombre de los users que han enviado petición de amistad
            for(let i = 0; peticiones !== undefined && i < peticiones.length; i++){

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
                    for(let i = 0; listaAmigos !== undefined && i < listaAmigos.length; i++){
                        console.log(`Id del user 1 después de la consulta: ${listaAmigos[i].id_user1}`);
                        console.log(`Id del user 2 después de la consulta: ${listaAmigos[i].id_user2}`);

                        if(response.locals.userId == listaAmigos[i].id_user1)
                            sacar_amigo = listaAmigos[i].id_user2;
                        else
                            sacar_amigo = listaAmigos[i].id_user1;

                        daoUsers.getUser(sacar_amigo, function (error, user) {
                            if (error) {
                                response.status(500);
                            } else {
                                response.status(200);
                                console.log(`Objeto que devuelve la consulta del getUser: ${user.nombre_completo}`);
                                arrayAmigos.push(listaAmigos[i]);
                                arrayAmigos[i].nombre_completo=user.nombre_completo;
                            }
                        });
                    }
                    response.status(200);
                    response.render("mis_amigos", { amigos: arrayAmigos, puntos: response.locals.userPoints, peticiones: arrayPeticiones});
                }
            });
        }
    });
});

module.exports = amigos;