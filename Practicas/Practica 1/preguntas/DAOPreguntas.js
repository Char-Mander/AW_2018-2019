"use strict";

class DAOPreguntas {

    constructor(pool) {
        this.pool = pool;
    }

    /*Inserta un usuario en la base de datos y, si no ha habido error, devuelve el objeto que representa el usuario*/
    insertQuestion(question, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"), null);
            }else{

                const sql = `INSERT INTO preguntas(id, texto) VALUES (?,?)`
                let elems = [question.id, question.texto];

                connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        callback(new Error("Error en el proceso de registro"), null);
                    }else{
                        question.id = resultado.insertId;
                        let elems = [];
                        let sqlRespuestas = generarSentenciaInsertarRespuestas(question, elems);

                        connection.query(sqlRespuestas, elems, function (err, resultado) {
                            if (err)
                                callback(new Error("Error de acceso a la base de datos"), null);
                            else {
                                console.log("Nueva pregunta insertada correctamente");
                                callback(null, question.id);
                            }
                        });
                    }
                 });
            }
        })
    }

    insertRespuestaPropia(respuesta_propia, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"));
            else{
                
                const sql_get_id = `SELECT id FROM respuestas WHERE texto = ?`;

                connection.query(sql_get_id, [respuesta_propia.texto], function(err, resultado){
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else{
                        console.log("Id de la respuesta: " + resultado[0].id);
                        respuesta_propia.id = resultado[0].id;
                        console.log("Pasa por el sacar id correctamente");
                        const sql = `INSERT INTO respuestas_propias(id_pregunta, id_respuesta, id_user) VALUES (?,?,?)`;
                        console.log("Respuesta propia: " + respuesta_propia.id + " " + respuesta_propia.id_user + " "
                        + " " + respuesta_propia.id_pregunta);
                        let elems = [Number(respuesta_propia.id_pregunta), respuesta_propia.id, respuesta_propia.id_user];

                        connection.query(sql, elems, function(err, resultado){
                            connection.release();
                            if(err)
                                callback(new Error("Error de acceso a la base de datos"));
                            else{
                                console.log("Pasa por el insertar respuesta propia correctamente");
                                console.log("Respuesta propia guardada correctamente");
                                callback(null);
                            }
                        })
                    }
                })
            }
        })
    }

    getRandomQuestions(callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = "SELECT * FROM preguntas ORDER BY RAND() LIMIT 5";

                connection.query(sql, function(err, resultado){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Preguntas aleatorias leídas correctamente");
                        callback(null, resultado);
                    }
                })
            }
        })
    }

    getQuestion(id, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT * FROM preguntas WHERE id = ?`
                
                connection.query(sql, [id], function(err, pregunta){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Pregunta leída correctamente");
                        callback(null, pregunta);
                    }
                })
            }

        })
    }

    getIfRespondida(id_pregunta, id_user, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT id_user FROM respuestas_propias WHERE id_pregunta = ? AND id_user = ?`;

                connection.query(sql, [id_pregunta, id_user], function(error, resultado){
                    connection.release();
                    if(error)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Usuario leído correctamente");
                        callback(null, resultado);
                    }
                })
            }
        })
    }

    getRespuestas(id_pregunta, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT * FROM respuestas WHERE id_pregunta = ?`;

                connection.query(sql, [id_pregunta], function(err, respuestas){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Respuestas leídas correctamentes");
                        callback(null, respuestas);
                    }
                })
            }
        })
    }

    getAmigosQueHanRespondido(id_pregunta, id_user, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT id_user, nombre_completo, correct
                            FROM user 
                            LEFT JOIN amigos ON (id_user1 = ? AND id_user2 = id_user) OR (id_user2 = ? AND id_user1 = id_user)
                            LEFT JOIN respuestas_adivinadas ON (id_propio = ? AND id_amigo = id_user AND id_pregunta = ?)
                            WHERE id_user IN (SELECT id_user 
                                            FROM respuestas_propias 
                                            WHERE id_pregunta = ?) 
                            AND id_user != ?`;

                let elems = [id_user, id_user, id_user, id_pregunta, id_pregunta, id_user];

                connection.query(sql, elems, function(err, amigos){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Usuarios que han respondido leídos correctamente");
                        callback(null, amigos);
                    }
                })
            }
        })
    }


    getIfAdivinada(id_pregunta, id_user, id_amigo, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT correct FROM respuestas_adivinadas WHERE id_propio = ? AND id_amigo = ? AND id_pregunta = ?`;
                let elems = [id_user, id_amigo, id_pregunta];

                connection.query(sql, elems, function(err, correct){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Acierto leído correctamente");
                        callback(null, correct[0]);
                    }
                })
            }
        })
    }


    getRespuestaPropia(id_user, id_pregunta, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT id_respuesta FROM respuestas_propias WHERE id_pregunta = ? AND id_user = ?`;
                let elems = [id_pregunta, id_user];

                connection.query(sql, elems, function(err, id_respuesta){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        console.log("Acierto leído correctamente");
                        callback(null, id_respuesta[0]);
                    }
                })
            }
        })
    }


    insertRespuestaAdivinada(id_pregunta, id_respuesta, id_amigo, id_propio, correct, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"));
            else{
                const sql = `INSERT INTO respuestas_adivinadas(id_pregunta, id_respuesta, id_amigo, id_propio, correct, vista) VALUES (?,?,?,?,?,?)`;
                let elems = [id_pregunta, id_respuesta, id_amigo, id_propio, correct, false];

                connection.query(sql, elems, function(err){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else{
                        console.log("Respuesta adivinada insertada correctamente");
                        callback(null);
                    }
                })
            }
        })
    }
}

function generarSentenciaInsertarRespuestas(question, elems){
    let sql = `INSERT INTO respuestas(id_pregunta, id, texto) VALUES`;

    for(let i = 0; i < question.respuestas.length; i++){
        sql += `(?,?,?)`;
        elems.push(question.id);
        elems.push(question.respuestas[i].id);
        elems.push(question.respuestas[i]);

        if (i < question.respuestas.length - 1)
            sql += `,`;
    }

    return sql;
}

module.exports = DAOPreguntas;