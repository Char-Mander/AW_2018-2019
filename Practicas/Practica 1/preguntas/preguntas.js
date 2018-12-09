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

preguntas.get("/nueva_pregunta", function (request, response) {
    response.status(200);
    response.render("nueva_pregunta", { errorMsg: null });
});

preguntas.post("/nueva_pregunta", function (request, response) {
    let question = {};
    let respuesta_propia = {};

    respuesta_propia.id_user = request.session.currentUserId;

    question.texto = request.body.texto_pregunta;
    question.respuestas = [];

    question.respuestas.push(request.body.texto_respuesta1);
    question.respuestas.push(request.body.texto_respuesta2);
    question.respuestas.push(request.body.texto_respuesta3);
    question.respuestas.push(request.body.texto_respuesta4);

    if (request.body.correcta1 == "on")
        respuesta_propia.texto = request.body.texto_respuesta1;
    else if (request.body.correcta2 == "on")
        respuesta_propia.texto = request.body.texto_respuesta2;
    else if (request.body.correcta3 == "on")
        respuesta_propia.texto = request.body.texto_respuesta3;
    else if (request.body.correcta4 == "on")
        respuesta_propia.texto = request.body.texto_respuesta4;

    daoPreguntas.insertQuestion(question, function (error, pregunta_id) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("nueva_pregunta", { errorMsg: `${error.message}` });
        } else {
            respuesta_propia.id_pregunta = pregunta_id;
            if (respuesta_propia.texto !== undefined) {
                daoPreguntas.insertRespuestaPropia(respuesta_propia, function (error) {
                    if (error) {
                        response.status(500);
                        console.log(`${error.message}`);
                        response.render("nueva_pregunta", { errorMsg: `${error.message}` });
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

});

preguntas.get("/preguntas", function (request, response) {
    daoPreguntas.getRandomQuestions(function (error, preguntas) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("preguntas", { preguntas: null, errorMsg: `${error.message}` });
        } else {
            response.status(200);
            response.render("preguntas", { preguntas: preguntas, errorMsg: null });
        }
    })
});

preguntas.get("/info_pregunta", function (request, response) {
    let id_pregunta = request.query.id;
    let respondida = false;

    daoPreguntas.getQuestion(id_pregunta, function (error, pregunta) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("preguntas", { preguntas: null, errorMsg: `${error.message}` });
        } else {

            daoPreguntas.getIfRespondida(id_pregunta, request.session.currentUserId, function (error, user) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.render("preguntas", { preguntas: null, errorMsg: `${error.message}` });
                } else {
                    respondida = user.length !== 0;

                    daoPreguntas.getAmigosQueHanRespondido(id_pregunta, request.session.currentUserId, function (error, amigos) {
                        if (error) {
                            response.status(500);
                            console.log(`${error.message}`);
                            response.render("preguntas", { preguntas: null, errorMsg: `${error.message}` });
                        } else {
                            response.render("info_pregunta", { pregunta: pregunta[0], respondida: respondida, amigos: amigos });
                        }
                    })

                }
            })
        }
    })
});

preguntas.get("/responder_pregunta", function (request, response) {
    let pregunta = {};
    pregunta.id = request.query.id;
    pregunta.texto = request.query.texto;
    daoPreguntas.getRespuestas(pregunta.id, function (error, respuestas) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
        } else {
            response.status(200);
            response.render("responder_pregunta", { pregunta: pregunta, respuestas: respuestas });
        }
    })
});

preguntas.post("/responder_pregunta", function (request, response) {
    let respuesta_propia = {};
    let pregunta = {};
    pregunta.id = request.body.pregunta_id;
    pregunta.texto = request.body.pregunta_texto;
    respuesta_propia.id_user = request.session.currentUserId;
    respuesta_propia.id_pregunta = request.body.pregunta_id;
    respuesta_propia.texto = request.body.respuesta_texto;


    daoPreguntas.insertRespuestaPropia(respuesta_propia, function (error) {
        if (error) {
            response.status(500);
            console.log("Errror en insertar respuesta propia");
            console.log(`${error.message}`);
        } else {
            response.status(200);
            response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
        }
    })
});

preguntas.get("/adivinar_pregunta", function (request, response) {//pregunta.id, pregunta.texto, amigo.id
    let pregunta = {};
    let id_amigo = request.query.id_amigo;
    pregunta.id = request.query.id;
    pregunta.texto = request.query.texto;

    daoPreguntas.getRespuestas(pregunta.id, function (error, respuestas) {
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
                    response.render("adivinar_pregunta", { pregunta: pregunta, respuestas: respuestas, amigo: amigo });
                }
            })


        }
    })

});

preguntas.post("/adivinar_pregunta", function (request, response) {
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

            daoPreguntas.insertRespuestaAdivinada(pregunta.id, respuesta.id, id_amigo, request.session.currentUserId, correct, function (error) {
                if (error) {
                    response.status(500);
                    console.log(`${error.message}`);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                }else{
                    response.status(200);
                    response.redirect("/preguntas/info_pregunta?id=" + pregunta.id);
                }
            })
        }
    })

});

module.exports = preguntas;