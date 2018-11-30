"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const DAOUsers = require("./DAOUsers.js");
const config = require("../config");
const middlewares = require("../middlewares.js"); 

const users = express.Router();

const pool = mysql.createPool(config.mysqlConfig);

const daoUsers = new DAOUsers(pool);

const multerFactory = multer({ storage: multer.memoryStorage() });

//  Login del usuario
users.get("/signin", middlewares.middlewareLogged, function (request, response) {
    response.status(200);
    response.render("signIn", { errorMsg: null });
});

//COGE LOS DATOS DEL FORMULARIO DEL SIGNIN, Y REDIRECCIONA A LA VENTANA DE SESIÓN
users.post("/signin", function (request, response) {
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
    
            datos.edad=calcularEdad(datos.fecha_nacimiento);
            //response.render("sesion", { user: datos });
            response.redirect("/users/sesion");
        }
        else {
            response.render("signIn", { errorMsg: "Dirección de correo y/o contraseña no válidos." });
        }
    });
});

//  Registro del usuario
users.get("/signup", middlewares.middlewareLogged, function (request, response) {
    response.render("signup", { errorMsg: null });
});

users.post("/signup", multerFactory.single("user_img"), function (request, response) {
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
            console.log(`${error.message}`);
            response.render("signUp", { errorMsg: `${error.message}` });
        } else {
            user.id_user = id;
            response.status(200);
            request.session.currentUserEmail = user.email;
            request.session.currentUserId = user.id_user;
            request.session.currentUserPoints = user.puntos;
            response.redirect("/users/sesion");
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
            response.render("sesion", { user: usuario });
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
    response.render("modificar_perfil", { errorMsg: null, puntos: response.locals.userPoints});
});

users.post("/modificar_perfil", multerFactory.single("user_img"), function (request, response) {
    let user = {};

    user.email = response.locals.userEmail;
    user.password = request.body.password_user;
    user.nombre_completo = response.locals.userName;
    user.sexo = request.body.sexo;
    user.fecha_nacimiento = request.body.fecha;
    user.edad = calcularEdad(request.body.fecha);
    user.imagen_perfil = null;
    user.puntos = 0;

    if (request.file) {
        user.imagen_perfil = request.file.buffer;
    }

    daoUsers.updateUser(user, function (error) {
        if (error) {
            response.status(500);
            console.log(`${error.message}`);
            response.redirect("/users/modificar_perfil", { errorMsg: "Error en el proceso de modificación", puntos: response.locals.userPoints});
        } else {
            daoUsers.getUser(response.locals.userId, function (error, user) {
                if (error) {
                    response.status(500);
                } else {
                    user.edad = calcularEdad(user.fecha_nacimiento);
                    response.locals.userName=user.nombre_completo;
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