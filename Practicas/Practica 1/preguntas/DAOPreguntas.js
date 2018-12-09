"use strict";

class DAOPreguntas {

    constructor(pool) {
        this.pool = pool;
    }

    /*Inserta un usuario en la base de datos y, si no ha habido error, devuelve el objeto que representa el usuario*/
    insertQuesrion(question, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"), null);
            }else{

                const sql = `INSERT INTO preguntas VALUES (?,?)`
                let elems = [question.id, question.texto];

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


}

module.exports = DAOPreguntas;