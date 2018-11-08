"use strict";

class DAOUsers{
    constructor(pool) {
        this.pool=pool;
    }

    isUserCorrect(email, password, cb_isUserCorrect){
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(`Error de conexión a la base de datos`);
            }
            else{
                const sql = `SELECT * FROM user WHERE ? = email AND ? = password`;
                connection.query(sq, [email, password], function(err, resultado){
                    connection.release();
                    if(err){
                        cb_isUserCorrect(err, false);
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
                console.log(`Error de conexión a la base de datos`);
            }
            else{

            }
        });
    }
    
}

module.exports = DAOUsers;