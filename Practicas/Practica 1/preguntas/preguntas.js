"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DAOPreguntas = require("./DAOPreguntas.js");
const DAOUsers = require("../users/DAOUsers.js");
const config = require("../config");
const middlewares = require("../middlewares.js");

const preguntas = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

const daoPreguntas = new DAOPreguntas(pool);
const daoUsers = new DAOUsers(pool);

preguntas.get("/nueva_pregunta", middlewares.middlewareLogin, function (request, response) {
    response.status(200);
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    response.render("nueva_pregunta", { errorMsg: null, user: usuario });
});

preguntas.post("/nueva_pregunta", middlewares.middlewareLogin, function (request, response) {
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    let question = {};
    let respuesta_propia = {};

    respuesta_propia.id_user = request.session.currentUserId;

    request.checkBody("texto_pregunta", "La pregunta no puede ser vacía").notEmpty();
    request.checkBody("texto_respuesta1", "Las respuestas no pueden ser vacías").notEmpty();
    request.checkBody("texto_respuesta2", "Las respuestas no pueden ser vacías").notEmpty();
    request.checkBody("texto_respuesta3", "Las respuestas no pueden ser vacías").notEmpty();
    request.checkBody("texto_respuesta4", "Las respuestas no pueden ser vacías").notEmpty();
    request.getValidationResult().then(function (result) {
        if (result.isEmpty()) {
            question.texto = request.body.texto_pregunta;
            question.respuestas = [];

            question.respuestas.push(request.body.texto_respuesta1);
            question.respuestas.push(request.body.texto_respuesta2);
            question.respuestas.push(request.body.texto_respuesta3);
            question.respuestas.push(request.body.texto_respuesta4);

            daoPreguntas.insertQuestion(question, function (error, pregunta_id) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.render("nueva_pregunta", { errorMsg: `${error.message}`, user: usuario });
                } else {
                    respuesta_propia.id_pregunta = pregunta_id;
                    if (respuesta_propia.texto !== undefined) {
                        daoPreguntas.insertRespuestaPropia(respuesta_propia, function (error) {
                            if (error) {
                                response.status(500);
                                console.log(`${error.message}`);
                                response.render("nueva_pregunta", { errorMsg: `${error.message}`, user: usuario });
                            } else {
                                response.status(200);
                                response.redirect("/preguntas/preguntas");
                            }
                        })
                    } else {
                        response.status(200);
                        response.redirect("/preguntas/preguntas");
                    }
                }
            });
        } else {
            response.status(200);
            //Se meten todos los mensajes de error en un array
            let mensaje = result.array().map(n => " " + n.msg);
            mensaje.splice(2, 3);
            response.render("nueva_pregunta", { errorMsg: mensaje, user: usuario });
        }
    })



});

preguntas.get("/preguntas", middlewares.middlewareLogin, function (request, response) {
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    daoPreguntas.getRandomQuestions(function (error, preguntas) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("preguntas", { preguntas: null, errorMsg: `${error.message}`, user: usuario });
        } else {
            response.status(200);
            response.render("preguntas", { preguntas: preguntas, errorMsg: null, user: usuario });
        }
    })
});

preguntas.get("/info_pregunta", middlewares.middlewareLogin, function (request, response) {
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    let id_pregunta = request.query.id;
    let respondida = false;

    daoPreguntas.getQuestion(id_pregunta, function (error, pregunta) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("preguntas", { preguntas: null, errorMsg: `${error.message}`, user: usuario });
        } else {

            daoPreguntas.getIfRespondida(id_pregunta, request.session.currentUserId, function (error, user) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.render("preguntas", { preguntas: null, errorMsg: `${error.message}`, user: usuario });
                } else {
                    respondida = user.length !== 0;

                    daoPreguntas.getAmigosQueHanRespondido(id_pregunta, request.session.currentUserId, function (error, amigos) {
                        if (error) {
                            response.status(500);
                            console.log(`${error.message}`);
                            response.render("preguntas", { preguntas: null, errorMsg: `${error.message}`, user: usuario });
                        } else {

                            console.log(amigos);
                            response.render("info_pregunta", { pregunta: pregunta[0], respondida: respondida, amigos: amigos, user: usuario });
                        }
                    })

                }
            })
        }
    })
});

preguntas.get("/responder_pregunta", middlewares.middlewareLogin, function (request, response) {
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    let errorMsg = request.query.error;
    if (errorMsg === undefined) {
        errorMsg = null;
    }

    let pregunta = {};
    pregunta.id = request.query.id;
    pregunta.texto = request.query.texto;
    daoPreguntas.getRespuestas(pregunta.id, function (error, respuestas) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id + null);
        } else {
            response.status(200);
            response.render("responder_pregunta", { errorMsg: errorMsg, pregunta: pregunta, respuestas: respuestas, user: usuario });
        }
    })

});

preguntas.post("/responder_pregunta", middlewares.middlewareLogin, function (request, response) {
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    let respuesta_propia = {};
    let otra_respuesta = {};
    let pregunta = {};
    pregunta.id = request.body.pregunta_id;
    pregunta.texto = request.body.pregunta_texto;
    respuesta_propia.id_user = request.session.currentUserId;
    respuesta_propia.id_pregunta = request.body.pregunta_id;
    otra_respuesta.id_pregunta = request.body.pregunta_id;
    otra_respuesta.id_user = request.session.currentUserId;

    request.checkBody("respuesta_texto", "El campo de respuesta no puede estar vacío").notEmpty();
    request.getValidationResult().then(function (result) {
        if (result.isEmpty()) {

            console.log(request.body.otra);
            if (request.body.otra === "on") {
                otra_respuesta.texto = request.body.respuesta_texto;

                daoPreguntas.insertRespuestaPersonalizada(otra_respuesta, function (error) {
                    if (error) {
                        response.status(500);
                        console.log("Error al insertar la respuesta personalizada");
                        console.log(`${error.message}`);
                    } else {
                        response.status(200);
                        response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                    }
                });
            } else {
                respuesta_propia.texto = request.body.respuesta_texto;

                daoPreguntas.insertRespuestaPropia(respuesta_propia, function (error) {
                    if (error) {
                        response.status(500);
                        console.log("Error en insertar respuesta propia");
                        console.log(`${error.message}`);
                    } else {
                        response.status(200);
                        response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                    }
                });
            }
        } else {
            response.status(200);
            daoPreguntas.getRespuestas(pregunta.id, function (error, respuestas) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                } else {
                    response.status(200);
                    //Se meten todos los mensajes de error en un array
                    let mensaje = result.array().map(n => " " + n.msg);
                    response.redirect("/preguntas/responder_pregunta?id=" + pregunta.id + "&error=" + mensaje + "&texto=" + pregunta.texto);
                }
            })
        }
    });
});

preguntas.get("/adivinar_pregunta", middlewares.middlewareLogin, function (request, response) {//pregunta.id, pregunta.texto, amigo.id
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    let pregunta = {};
    let id_amigo = request.query.id_amigo;
    pregunta.id = request.query.id;
    pregunta.texto = request.query.texto;

    /*daoPreguntas.getRespuestas(pregunta.id, function (error, respuestas) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
        } else {

            daoUsers.getUser(id_amigo, function (error, amigo) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                } else {
                    response.status(200);
                    response.render("adivinar_pregunta", { pregunta: pregunta, respuestas: respuestas, amigo: amigo, user: usuario });
                }
            })
        }
    })*/

    daoPreguntas.get3RandomAnswers(pregunta.id, function(error, respuestas){
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
        } else {
            daoPreguntas.getCorrectAnswer(id_amigo, pregunta.id, function(error, respuesta){
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                }else{
                    let respuesta_nueva = {};
                    respuesta_nueva.texto = respuesta;

                    let pos_aleatoria = Math.floor(Math.random()*4);
                    let aux;
                    if(pos_aleatoria !== 3){
                        aux = respuestas[pos_aleatoria];
                        respuestas[pos_aleatoria] = respuesta_nueva;
                        respuestas.push(aux);
                    }else
                        respuestas.push(respuesta_nueva);

                    daoUsers.getUser(id_amigo, function (error, amigo) {
                        if (error) {
                            response.status(500);
                            console.log(`${error.message}`);
                            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                        } else {
                            response.status(200);
                            response.render("adivinar_pregunta", { pregunta: pregunta, respuestas: respuestas, amigo: amigo, user: usuario });
                        }
                    })
                }
            })
        }
    })

});

preguntas.post("/adivinar_pregunta", middlewares.middlewareLogin, function (request, response) {
    let usuario = {};
    usuario.puntos = request.session.currentUserPoints;
    usuario.id = request.session.currentUserId;
    usuario.img = request.session.currentUserImg;

    let respuesta = {};
    let pregunta = {};
    let correct = false;
    let id_amigo = request.body.id_amigo;

    respuesta.id = request.body.respuesta_id;
    respuesta.texto = request.body.respuesta_texto;

    pregunta.id = request.body.pregunta_id;
    pregunta.texto = request.pregunta_texto;

    daoPreguntas.getRespuestaPropia(id_amigo, pregunta.id, function (error, id_respuesta) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
        } else {
            let correct = respuesta.id == id_respuesta.id_respuesta;
            let vista = false;
            if(correct)
                request.session.currentUserPoints = request.session.currentUserPoints + 50;
            else{
                if(request.session.currentUserPoints - 50 < 0)
                    request.session.currentUserPoints = 0;
                else
                    request.session.currentUserPoints = request.session.currentUserPoints - 50;
            }

            daoPreguntas.insertRespuestaAdivinada(pregunta.id, respuesta.id, id_amigo, request.session.currentUserId, correct, vista, function (error) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                } else {
                    response.status(200);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                }
            })
        }
    })

});

module.exports = preguntas;