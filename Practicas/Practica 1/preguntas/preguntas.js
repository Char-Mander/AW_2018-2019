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

    question.texto = request.body.texto_pregunta;
    question.respuestas = [];
    question.correctos = [];

    question.respuestas.push(request.body.texto_respuesta1);
    question.respuestas.push(request.body.texto_respuesta2);
    question.respuestas.push(request.body.texto_respuesta3);
    question.respuestas.push(request.body.texto_respuesta4);

    if(request.body.correcta1 == "on")
        question.correctos.push(true);
    else
        question.correctos.push(false);

    if(request.body.correcta2 == "on")
        question.correctos.push(true);
    else
        question.correctos.push(false);
    
    if(request.body.correcta3 == "on")
        question.correctos.push(true);
    else
        question.correctos.push(false);

    if(request.body.correcta4 == "on")
        question.correctos.push(true);
    else
        question.correctos.push(false);

    daoPreguntas.insertQuestion(question, function (error) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("nueva_pregunta", { errorMsg: `${error.message}` });
        } else {
            response.status(200);
            response.redirect("/preguntas/preguntas");
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

preguntas.get("/responder_pregunta", function(request, response){
    response.status(200);
    response.render("responder_pregunta");
});

module.exports = preguntas;