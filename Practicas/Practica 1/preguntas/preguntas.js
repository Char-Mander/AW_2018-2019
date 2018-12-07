"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DAOPreguntas = require("./DAOPreguntas.js");
const config = require("../config");
const middlewares = require("../middlewares.js"); 

const preguntas = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

const daoPreguntas = new DAOPreguntas(pool);
preguntas.get("/nueva_pregunta", function(request, response){
    response.status(200);
    response.render("nueva_pregunta", { errorMsg : null });
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

    if(request.body.correcta1 == "on")
        respuesta_propia.texto = request.body.texto_respuesta1;
    else if(request.body.correcta2 == "on")
        respuesta_propia.texto = request.body.texto_respuesta2;
    else if(request.body.correcta3 == "on")
        respuesta_propia.texto = request.body.texto_respuesta3;
    else if(request.body.correcta4 == "on")
        respuesta_propia.texto = request.body.texto_respuesta4;

    daoPreguntas.insertQuestion(question, function (error, pregunta_id) {
        console.log("Entrada en la callback de insertQuestion");
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("nueva_pregunta", { errorMsg: `${error.message}` });
        } else {
            console.log("Todo bien en el insert");
            respuesta_propia.id_pregunta = pregunta_id;
            console.log("Id de la pregunta: " + respuesta_propia.id_pregunta);
            console.log("Texto de la respuesta: " + respuesta_propia.texto);
            daoPreguntas.insertRespuestaPropia(respuesta_propia, function(error){
                console.log("Entrada en la callback de isertRespuesta");
                if(error){
                    response.status(500);
                    console.log(`${error.message}`);
                    response.render("nueva_pregunta", { errorMsg: `${error.message}` });
                }else{
                    response.status(200);
                    response.redirect("/preguntas/preguntas");
                }
            })
        }
    });

});

preguntas.get("/preguntas", function(request, response){
    daoPreguntas.getRandomQuestions(function(error, preguntas){
        if(error){
            response.status(500);
            console.log(`${error.message}`);
            response.render("preguntas", { preguntas : null, errorMsg : `${error.message}` });
        }else{
            response.status(200);
            response.render("preguntas", { preguntas : preguntas, errorMsg : null });
        }
    })
});

preguntas.post("/info_pregunta", function(request, response){
    let id_pregunta = request.body.pregunta_id;
    daoPreguntas.getQuestion(id_pregunta, function(error, pregunta){
        if(error){
            response.status(500);
            console.log(`${error.message}`);
            response.render("preguntas", { preguntas : null, errorMsg : `${error.message}` });
        }else{
            response.status(200);
            response.render("info_pregunta", { pregunta : pregunta });
        }
    })
});

preguntas.get("/responder_pregunta", function(request, response){
    response.status(200);
    response.render("responder_pregunta");
});

preguntas.post("/responder_pregunta", function(request, response){

});

module.exports = preguntas;