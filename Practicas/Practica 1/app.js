"use strict";

const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const multer = require("multer");
const DAOUsers = require("./DAOUsers.js");
const DAOAplicacion = require("./DAOAplicacion.js");
const config = require("./config.js");

//  Creación de una aplicación express
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));


//  Configuración de fichero estáticos
const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));


//  MySQLSession
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
});

//  Middlewares
app.use(bodyParser.urlencoded({ extended: true })); //body-parser

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});
app.use(middlewareSession); //express-mysql-session

const multerFactory = multer({ storage: multer.memoryStorage() });  //multer (para la subida y bajada de ficheros)

//Middleware que limita el acceso a la sesión sin estar loggeado
function middlewareLogin(request, response, next) {
    if (request.session.currentUserEmail !== undefined) {
        response.locals.userId = request.session.currentUserId;
        response.locals.userEmail = request.session.currentUserEmail;
        response.locals.userName = request.session.currentUserName;
        response.locals.userPoints = request.session.currentUserPoints;
        next();
    }
    else {
        response.redirect("/signin");
    }
}

//  Creación de un pool de conexiones a una base de datos MySQL
const pool = mysql.createPool(config.mysqlConfig);


//  Creación de una instancia de DAOUsers
const daoUsers = new DAOUsers(pool);
const daoAplicacion = new DAOAplicacion(pool);


//  Login del usuario
app.get("/signin", function (request, response) {
    response.status(200);
    response.render("signIn", { errorMsg: null });
});


//COGE LOS DATOS DEL FORMULARIO DEL SIGNIN, Y REDIRECCIONA A LA VENTANA DE SESIÓN
app.post("/signin", function (request, response) {
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
            request.session.currentUserName = datos.nombre_completo;
            request.session.currentUserPoints = datos.puntos;
    
            datos.edad=calcularEdad(datos.fecha_nacimiento);
            response.render("sesion", { user: datos });
        }
        else {
            response.render("signIn", { errorMsg: "Dirección de correo y/o contraseña no válidos." });
        }
    });
});

//  Registro del usuario
app.get("/signup", function (request, response) {
    response.render("signup", { errorMsg: null });
});

app.post("/signup", multerFactory.single("user_img"), function (request, response) {
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
            request.session.currentUser = user.email;
            response.render("sesion", { user: user });
        }
    });

});




//VENTANA DE SESIÓN DEL USUARIO
app.get("/sesion", middlewareLogin, function (request, response) {
    daoUsers.getUser(response.locals.userId, function (error, usuario) {
        if (error) {
            response.status(500);
        } else {
            response.status(200);
            usuario.edad = calcularEdad(usuario.fecha_nacimiento);
            response.render("sesion", { user: usuario });
        }
    });
});


app.get("/no_profile_pic", middlewareLogin, function (request, response) {
    response.sendFile(path.join(__dirname, "profile_imgs", "NoPerfil.png"));
});


//  Desconexión del usuario
app.get("/signout", middlewareLogin, function (request, response) {
    response.status(200);
    request.session.destroy();
    response.redirect("/signin");
});


app.get("/imagen/:id", middlewareLogin, function (request, response) {
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

//middelware del login, comprueba que esté en la sesión del usuario
app.use(middlewareLogin);


//  Modificación del usuario
app.get("/modificar_perfil", middlewareLogin, function (request, response) {
    response.status(200);
    response.render("modificar_perfil", { errorMsg: null, puntos: response.locals.userPoints});
});

app.post("/modificar_perfil", middlewareLogin, multerFactory.single("user_img"), function (request, response) {
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
            response.render("modificar_perfil", { errorMsg: "Error en el proceso de modificación", puntos: response.locals.userPoints});
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

//VENTANA DEL LISTADO DE PETICIONES DE AMISTAD Y AMIGOS DE UN USUARIO
app.get("/mis_amigos", middlewareLogin, function (request, response) {
    //Sacamos la lista de peticiones
    daoAplicacion.getPeticiones(response.locals.userId, function (error, peticiones){
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
            daoAplicacion.getAmigos(response.locals.userId, function (error, listaAmigos) {
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
                    console.log(`Antes de entrar: ${arrayAmigos}`);
                    response.status(200);
                    response.render("mis_amigos", { amigos: arrayAmigos, puntos: response.locals.userPoints, peticiones: arrayPeticiones});
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

//  Arranque del servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
