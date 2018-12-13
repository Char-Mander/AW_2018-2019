"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DAOUsers = require("./DAOUsers.js");
const config = require("../config");
const middlewares = require("../middlewares.js");
const DAOAplicacion = require("../aplicacion/DAOAplicacion.js");

const users = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

const daoUsers = new DAOUsers(pool);
const daoAplicacion = new DAOAplicacion(pool);

const multerFactory = multer({ storage: multer.memoryStorage() });

//  Login del usuario
users.get("/signin", middlewares.middlewareLogged, function (request, response) {
    response.status(200);
    response.render("signIn", { errorMsg: null });
});

//COGE LOS DATOS DEL FORMULARIO DEL SIGNIN, Y REDIRECCIONA A LA VENTANA DE SESIÓN
users.post("/signin", function (request, response) {
    //  Comprobar que los campos obligatorios no estén vacíos
    request.checkBody("email_user", "El email del usuario está vacío").notEmpty();
    request.checkBody("password_user", "La contraseña está vacía").notEmpty();
    request.getValidationResult().then(function (result) {
        // El método isEmpty() devuelve true si las comprobaciones
        // no han detectado ningún error
        if (result.isEmpty()) {
            let user = {
                email: "",
                password: ""
            }
            user.email = request.body.email_user;
            user.password = request.body.password_user;

            daoUsers.isUserCorrect(user.email, user.password, function (error, res, datos) {
                if (error) {
                    response.render("signIn", { errorMsg: "Error" });
                }
                else if (res) {
                    response.status(200);
                    request.session.currentUserId = datos.id_user;
                    request.session.currentUserEmail = datos.email;
                    request.session.currentUserPoints = datos.puntos;
                    if(datos.imagen_perfil !== undefined)
                        request.session.currentUserImg = true;

                    datos.edad = calcularEdad(datos.fecha_nacimiento);
                    response.redirect("/users/sesion");
                }
                else {
                    response.status(200);
                    response.render("signIn", { errorMsg: "Dirección de correo y/o contraseña no válidos." });
                }
            });
        } else {
            response.status(200);
            //Se meten todos los mensajes de error en un array
            let mensaje = result.array().map(n => " " + n.msg);
            response.render("signin", { errorMsg: mensaje });
        }
    });
});


//  Registro del usuario
users.get("/signup", middlewares.middlewareLogged, function (request, response) {
    response.render("signup", { errorMsg: null });
});

users.post("/signup", multerFactory.single("user_img"), function (request, response) {

    //  Comprobar que los campos obligatorios no estén vacíos
    request.checkBody("email_user", "El email del usuario está vacío").notEmpty();
    request.checkBody("password_user", "La contraseña está vacía").notEmpty();
    request.checkBody("name_user", "El nombre del usuario está vacío").notEmpty();
    request.checkBody("fecha", "La fecha de nacimiento del usuario está vacía").notEmpty();
    request.checkBody("sexo", "El campo del sexo está vacío").notEmpty();
    //  Comprobar que la contraseña tenga un mínimo y un máximo de longitud
    request.checkBody("password_user", "La contraseña no es válida").isLength({ min: 4, max: 20 });
    //  Comprobar que el formato del email sea correcto
    request.checkBody("email_user", "La dirección de correo no es válida").isEmail();
    //  Comprobar que la fecha de nacimiento sea anterior a la fecha actual
    request.checkBody("fecha", "La fecha de nacimiento no es válida").isBefore();

    request.getValidationResult().then(function (result) {
        // El método isEmpty() devuelve true si las comprobaciones
        // no han detectado ningún error
        if (result.isEmpty()) {
            let user = {};

            user.email = request.body.email_user;
            user.password = request.body.password_user;
            user.nombre_completo = request.body.name_user;
            user.sexo = request.body.sexo;
            user.fecha_nacimiento = request.body.fecha;
            user.edad = calcularEdad(request.body.fecha);
            user.imagen_perfil = null;

            if (request.file) {
                user.imagen_perfil = request.file.buffer;
            }

            daoUsers.insertUser(user, function (error, id) {
                if (error) {
                    response.status(500);
                    response.render("signup", { errorMsg: `${error.message}` });
                } else {
                    user.id_user = id;
                    response.status(200);
                    request.session.currentUserEmail = user.email;
                    request.session.currentUserId = user.id_user;
                    request.session.currentUserPoints = user.puntos;
                    if(user.imagen_perfil !== undefined)
                        request.session.currentUserImg = true;
                    response.redirect("/users/sesion");
                }
            });
        } else {
            response.status(200);
            //Se meten todos los mensajes de error en un array
            let mensaje = result.array().map(n => " " + n.msg);
            response.render("signUp", { errorMsg: mensaje });
        }
    });



});

//VENTANA DE SESIÓN DEL USUARIO
users.get("/sesion", middlewares.middlewareLogin, function (request, response) {
    daoUsers.getUser(request.session.currentUserId, function (error, usuario) {
        if (error) {
            response.status(500);
        } else {
            response.status(200);
            usuario.edad = calcularEdad(usuario.fecha_nacimiento);
            daoAplicacion.getListadoNotificaciones(request.session.currentUserId, function(error, listado){
                if (error) {
                    console.log(error.message);
                }
               // else{
                    //response.status(200);
                   // daoAplicacion.actualizarNotificaciones(request.session.currentUserId, function(error){
                    //    if(error){
                      //      response.status(500);
                        //    console.log(error.messsage);
                        //}
                       // else {
                            response.status(200);
                            response.render("sesion", { user: usuario, notificaciones: listado });
                        //}
                   // });
                //}
            });

          
        }
    });
});

users.get("/no_profile_pic", middlewares.middlewareLogin, function (request, response) {
    response.sendFile(path.join(__dirname, "../profile_imgs", "NoPerfil.png"));
});


//  Desconexión del usuario
users.get("/signout", middlewares.middlewareLogin, function (request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/users/signin");
});

users.get("/imagen/:id", middlewares.middlewareLogin, function (request, response) {
    let n = Number(request.params.id);

    if (isNaN(n)) {
        response.status(400);
        response.end("Petición incorrecta");
    } else {
        obtenerImagen(n, function (err, imagen) {
            if (imagen) {
                response.end(imagen);
            } else {
                response.status(404);
                response.end("Not found");
            }
        });
    }
});

//  Modificación del usuario
users.get("/modificar_perfil", middlewares.middlewareLogin, function (request, response) {
    response.status(200);
    let user = {
        id_user: request.session.currentUserId,
        puntos: request.session.currentUserPoints,
        imagen_perfil: request.session.currentUserImg
    }
   
    response.render("modificar_perfil", { errorMsg: null, user: user });
});

users.post("/modificar_perfil", middlewares.middlewareLogin, multerFactory.single("user_img"), function (request, response) {
    let user = {};

    user.email = request.session.currentUserEmail;
    user.password = request.body.password_user;
    user.nombre_completo = request.body.name_user;
    user.sexo = request.body.sexo;
    user.fecha_nacimiento = request.body.fecha;
    user.edad = calcularEdad(request.body.fecha);
    user.imagen_perfil = request.session.currentUserImg;
    user.puntos=request.session.currentUserPoints;
    
    if (request.file) {
        user.imagen_perfil = request.file.buffer;
    }

    daoUsers.updateUser(user, function (error) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            let usr = {
                id: request.session.currentUserId,
                puntos:  request.session.currentUserPoints,
                imagen: request.session.currentUserImg
            }
            response.redirect("/users/modificar_perfil", { errorMsg: "Error en el proceso de modificación", user: usr });
        } else {
            daoUsers.getUser(request.session.currentUserId, function (error, user) {
                if (error) {
                    response.status(500);
                } else {
                    user.edad = calcularEdad(user.fecha_nacimiento);
                    if(user.imagen_perfil)
                        request.session.currentUserImg = true;
                    response.render("sesion", { user: user });
                }
            });
        }
    });
});

//  Funciones auxiliares
function obtenerImagen(id, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err);
        } else {
            let sql = `SELECT imagen_perfil FROM user WHERE id_user = ?`;
            connection.query(sql, [id], function (err, result) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    if (result.length === 0) {
                        callback("No existe");
                    } else {
                        callback(null, result[0].imagen_perfil);
                    }
                }
            });
        }
    });
}

function calcularEdad(fecha) {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}

module.exports = users;