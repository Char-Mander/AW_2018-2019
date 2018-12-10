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

                if(user.email === "" || user.nombre_completo === "" || user.password === ""){
                    callback(new Error("Se deben llenar los campos obligatorios"), null);
                }

                const sql = `INSERT INTO user (id_user, email, password, nombre_completo, sexo, fecha_nacimiento, imagen_perfil)`
                 + `VALUES (?,?,?,?,?,?,?)`;
                 let elems = [user.id_user, user.email, user.password, user.nombre_completo, user.sexo, user.fecha_nacimiento, user.imagen_perfil];

                 connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        callback(new Error("Error en el proceso de registro"), null);
                    }else{
                        callback(null, resultado.insertId);
                    }
                 });
            }
        })
    }

    /*Devuelve todos los datos del usuario cuyo email es el introducido*/
    getUser(id, cb_getUser){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getUser(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT * FROM user WHERE id_user = ?`;

                connection.query(sql, [id], function(err, resultado){
                    connection.release();
                    if(err){
                        cb_getUser(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        cb_getUser(null, resultado[0]);
                    }
                });
            }
        });
    }

    getAllUsers(cb_getAllUsers){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getAllUsers(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT * FROM user`;

                connection.query(sql, function(err, resultado){
                    connection.release();
                    if(err){
                        cb_getAllUsers(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        cb_getAllUsers(null, resultado);
                    }
                });
            }
        });
    }

    /*Guarda un usuario en la base de datos*/
    updateUser(user, cb_updateUser){
        this.pool.getConnection(function(error, connection){
            if(error){
                cb_updateUser(new Error("Error de conexión a la base de datos"), null);
            }else{
                let elems = [];
                const sql = crearSentenciaUpdateUser(user, elems);
                connection.query(sql, elems, function(error, resultado){
                    connection.release();
                    if(error){
                        cb_updateUser(new Error("Error de acceso a la base de datos"));
                    }else{
                        cb_updateUser(null);
                        console.log("Update insertado correctamente");
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
                        cb_isUserCorrect(null, true, resultado[0]);
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
    updatePoints(id, newPoints, cb_updatePoints){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getUserImageName(new Error("Error de conexión a la base de datos"), false);
            }
            else{
                const sql = `UPDATE user SET puntos = ? WHERE id_user = ? `;
                let elems = [newPoints, id]; 
                    connection.release();
                    if(err){
                        cb_getUserImageName(new Error("Error de acceso a la base de datos"));
                    }
                    else{
                        cb_getUserImageName(null);
                    }
                })
            }
        });
    }
    
}

function crearSentenciaUpdateUser(user, elems){
    let sql = `UPDATE user SET `;
    let firstElem=1;

    for(let contador=0; contador<Object.values(user).length; contador++){
        
        if(user[`${Object.keys(user)[contador]}`] && user[`${Object.keys(user)[contador]}`] !== undefined && `${Object.keys(user)[contador]}`!=="edad"){

            if(firstElem!==1){
               sql+=`, `;
            }
            else{
                firstElem=0;
            }

            sql+= `${Object.keys(user)[contador]} = ?`;
            elems.push(user[`${Object.keys(user)[contador]}`]);
        }
      
    }

    sql += ` WHERE email = ?`
    elems.push(user.email);
    return sql;
}

module.exports = DAOUsers;