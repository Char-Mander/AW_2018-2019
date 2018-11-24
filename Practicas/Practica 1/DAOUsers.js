"use strict";

class DAOUsers{
    constructor(pool) {
        this.pool = pool;
    }

    /*Inserta un usuario en la base de datos y, si no ha habido error, devuelve el objeto que representa el usuario*/
    insertUser(user, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `INSERT INTO user (id_user, email, password, nombre_completo, sexo, fecha_nacimiento, imagen_perfil)`
                 + `VALUES (?,?,?,?,?,?,?)`;
                 let elems = [user.id_user, user.email, user.password, user.nombre_completo, user.sexo, user.fecha_nacimiento, user.imagen_perfil];

                 connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        callback(null, resultado.insertId);
                    }
                 });
            }
        })
    }

    /*Devuelve todos los datos del usuario cuyo email es el introducido*/
    getUser(email, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT * FROM user WHERE email = ?`;

                connection.query(sql, email, function(err, resultado){
                    connection.release();
                    if(err){
                        callback(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        callback(null, resultado[0]);
                    }
                });
            }
        });
    }

    /*Comprueba que es usuario "email" existe en la base de datos, y que su contraseña es "password"*/
    isUserCorrect(email, password, cb_isUserCorrect){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_isUserCorrect(new Error("Error de conexión a la base de datos"), false);
            }
            else{
                const sql = `SELECT * FROM user WHERE email = ? AND password = ?`;
                connection.query(sql, [email, password], function(err, resultado){
                    connection.release(); 
                    if(err){
                        cb_isUserCorrect(new Error("Error de acceso a la base de datos"), false);
                    } else if(resultado.length!==0){
                        cb_isUserCorrect(null, true);
                    }
                    else{
                        cb_isUserCorrect(null, false);
                    }
                })
            }
        });
    }

    
    /*Obtiene el nombre del fichero de la imagen del usuario "email"*/
    getUserImageName(email, cb_getUserImageName){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getUserImageName(new Error("Error de conexión a la base de datos"), false);
            }
            else{
                const sql = `SELECT img FROM user WHERE ? = email`;
                connection.query(sql, [email], function(err, fich_img){
                    connection.release();
                    if(err){
                        cb_getUserImageName(new Error("Error de acceso a la base de datos"), null);
                    }
                    else if(fich_img.length!==0){
                        cb_getUserImageName(null, fich_img);
                    }
                    else{
                        cb_getUserImageName(null, null);
                    }
                })
            }
        });
    }
    
}

module.exports = DAOUsers;