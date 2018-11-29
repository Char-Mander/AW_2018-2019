"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DAOUsers = require("./DAOPreguntas.js");
const config = require("../config");
const middlewares = require("../middlewares.js"); 

const preguntas = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

const daoUsers = new DAOUPreguntas(pool);

preguntas.get("/crear_pregunta", function(request, response){
    response.status(200);
    response.render("nueva_pregunta", { errorMsg : null });
});

users.post("/signup", multerFactory.single("user_img"), function (request, response) {
    let question = {};

    question.texto

    daoUsers.insertUser(user, function (error, id) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.render("signUp", { errorMsg: `${error.message}` });
        } else {
            user.id_user = id;
            response.status(200);
            request.session.currentUser = user.email;
            response.render("sesion", { user: user });
        }
    });

});