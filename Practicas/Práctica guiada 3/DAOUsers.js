"use strict";

class DAOUsers{
    constructor(pool) {
        this.pool=pool;
    }

    isUserCorrect(email, password, cb_isUserCorrect){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_isUserCorrect(new Error("Error de conexión a la base de datos"), false);
            }
            else{
                const sql = `SELECT * FROM user WHERE ? = email AND ? = password;`;
                connection.query(sql, [email, password], function(err, resultado){
                    connection.release();
                    if(err){
                        cb_isUserCorrect(new Error("Error de acceso a la base de datos"), false);
                    } else if(resultado==null){
                        cb_isUserCorrect(null, false);
                    }
                    else{
                        cb_isUserCorrect(null, true);
                    }
                })
            }
        });
    }

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
                    else if(fich_img == null){
                        cb_getUserImageName(null, null);
                    }
                    else{
                        cb_getUserImageName(null, fich_img);
                    }
                })
            }
        });
    }
    
}

module.exports = DAOUsers;