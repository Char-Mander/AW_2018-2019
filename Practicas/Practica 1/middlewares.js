"use strict";

const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const config = require("./config.js");

//  MySQLSession
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
});


const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

//Middleware que limita el acceso a la sesión sin estar loggeado
function middlewareLogin(request, response, next) {
    if (request.session.currentUserEmail !== undefined) {
        response.locals.userId = request.session.currentUserId;
        response.locals.userEmail = request.session.currentUserEmail;
        response.locals.userPoints = request.session.currentUserPoints; 
        response.locals.userImg = request.session.currentUserImg; 
        
        next();
    }
    else {
        response.redirect("/users/signin");
    }
}

function middlewareLogged(request, response, next){
    if(request.session.currentUserEmail !== undefined){
        response.redirect("/users/sesion");
    }
    else{
        next();
    }
}

const middlewares ={
    MySQLStore: MySQLStore,
    middlewareLogin: middlewareLogin,
    middlewareSession: middlewareSession,
    sessionStore: sessionStore,
    middlewareLogged: middlewareLogged
}

module.exports = middlewares;