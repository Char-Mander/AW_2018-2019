"use strict";

class DAOPreguntas {

    constructor(pool) {
        this.pool = pool;
    }

    /*Inserta un usuario en la base de datos y, si no ha habido error, devuelve el objeto que representa el usuario*/
    insertQuestion(question, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"), null);
            } else {

                const sql = `INSERT INTO preguntas(id, texto) VALUES (?,?)`
                let elems = [question.id, question.texto];

                connection.query(sql, elems, function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error en el proceso de registro"), null);
                    } else {
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

    insertRespuestaPropia(respuesta_propia, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {

                const sql_get_id = `SELECT id FROM respuestas WHERE texto = ?`;

                connection.query(sql_get_id, [respuesta_propia.texto], function (err, resultado) {
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {
                        if (resultado[0] !== undefined) {
                            respuesta_propia.id = resultado[0].id;
                            const sql = `INSERT INTO respuestas_propias(id_pregunta, id_respuesta, id_user) VALUES (?,?,?)`;
                            let elems = [Number(respuesta_propia.id_pregunta), respuesta_propia.id, respuesta_propia.id_user];

                            connection.query(sql, elems, function (err) {
                                connection.release();
                                if (err)
                                    callback(new Error("Error de acceso a la base de datos"));
                                else {
                                    console.log("Respuesta propia guardada correctamente");
                                    callback(null);
                                }
                            });
                        }
                        else {
                            callback(undefined);
                        }
                    }
                });
            }
        });
    }

    insertRespuestaPersonalizada(respuesta_propia, cb_respuestaPersonalizada) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                cb_respuestaPersonalizada(new Error("Error de conexión a la base de datos"));
            else {
                const query = `INSERT INTO respuestas (id_pregunta, id, texto) VALUES (?,'',?) `;
                const elems = [respuesta_propia.id_pregunta, respuesta_propia.texto];
                connection.query(query, elems, function (err) {
                    if (err)
                        cb_respuestaPersonalizada(new Error("Error de acceso a la base de datos"));
                    else {
                        console.log("Nueva respuesta insertada correctamente");
                        const sql_get_id = `SELECT MAX(id) AS id FROM respuestas`;
                        connection.query(sql_get_id, function (err, resultado) {
                            if (err)
                                cb_respuestaPersonalizada(new Error("Error de acceso a la base de datos"));
                            else {
                                console.log("Sacado el id de la nueva respuesta correctamente");
                                const sql = `INSERT INTO respuestas_propias(id_pregunta, id_respuesta, id_user) VALUES (?,?,?)`;
                                let elems = [Number(respuesta_propia.id_pregunta), resultado[0].id, respuesta_propia.id_user];
                                connection.query(sql, elems, function (err) {
                                    connection.release();
                                    if (err)
                                        cb_respuestaPersonalizada(new Error("Error de acceso a la base de datos"));
                                    else {
                                        console.log("Respuesta propia guardada correctamente");
                                        cb_respuestaPersonalizada(null);
                                    }
                                });

                            }
                        });
                    }
                })

            }
        });

    }

    getRandomQuestions(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = "SELECT * FROM preguntas ORDER BY RAND() LIMIT 5";

                connection.query(sql, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("Preguntas aleatorias leídas correctamente");
                        callback(null, resultado);
                    }
                })
            }
        })
    }

    get3RandomAnswers(id_pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT * FROM respuestas WHERE id_pregunta = ? ORDER BY RAND() LIMIT 3`;

                connection.query(sql, id_pregunta, function (err, respuestas) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("3 respuestas aleatorias leídas correctamente");
                        callback(null, respuestas);
                    }
                })
            }
        })
    }

    getCorrectAnswer(id_amigo, id_pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT id_respuesta FROM respuestas_propias WHERE id_user = ? AND id_pregunta = ?`;
                let elems = [id_amigo, id_pregunta];

                connection.query(sql, elems, function (err, id_respuesta_correcta) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("ID de la respuesta correcta leído correctamente");

                        const sql_texto = `SELECT texto FROM respuestas WHERE id = ?`;

                        connection.query(sql_texto, id_respuesta_correcta[0].id_respuesta, function (err, texto_respuesta) {
                            if (err)
                                callback(new Error("Error de acceso a la base de datos"), null);
                            else
                                callback(null, texto_respuesta[0].texto);
                        })
                    }
                })
            }
        })
    }

    getQuestion(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT * FROM preguntas WHERE id = ?`

                connection.query(sql, [id], function (err, pregunta) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("Pregunta leída correctamente");
                        callback(null, pregunta);
                    }
                })
            }

        })
    }

    getIfRespondida(id_pregunta, id_user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT id_user FROM respuestas_propias WHERE id_pregunta = ? AND id_user = ?`;

                connection.query(sql, [id_pregunta, id_user], function (error, resultado) {
                    connection.release();
                    if (error)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("Usuario leído correctamente");
                        callback(null, resultado);
                    }
                })
            }
        })
    }

    getRespuestas(id_pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT * FROM respuestas WHERE id_pregunta = ?`;

                connection.query(sql, [id_pregunta], function (err, respuestas) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("Respuestas leídas correctamentes");
                        callback(null, respuestas);
                    }
                })
            }
        })
    }

    getAmigosQueHanRespondido(id_pregunta, id_user, cb_getAmigosQueHanRespondido) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                cb_getAmigosQueHanRespondido(new Error("Error de conexión a la base de datos"), null);
            else {

                const amigos_sql = `SELECT id_user, nombre_completo, imagen_perfil 
                FROM user LEFT JOIN amigos ON id_user2 = id_user 
                WHERE id_user1 = ? AND id_user IN (SELECT id_user 
                                    FROM respuestas_propias 
                                    WHERE id_pregunta = ?)
                                    
                UNION 
                SELECT id_user, nombre_completo, imagen_perfil 
                FROM user LEFT JOIN amigos ON id_user1 = id_user 
                WHERE id_user2 = ? AND id_user IN (SELECT id_user 
                                    FROM respuestas_propias 
                                    WHERE id_pregunta = ?)`;

                let elems = [id_user, id_pregunta, id_user, id_pregunta];

                connection.query(amigos_sql, elems, function (err, amigos) {

                    if (err)
                        cb_getAmigosQueHanRespondido(new Error("Error de acceso a la base de datos"), null);
                    else {
                        const respuestas_adivinadas = `SELECT id_amigo, correct
                                FROM respuestas_adivinadas
                                WHERE id_propio = ? AND id_pregunta = ?`;

                        let elems2 = [id_user, id_pregunta];

                        connection.query(respuestas_adivinadas, elems2, function (err, adivinadas) {
                            connection.release();
                            if (err)
                                cb_getAmigosQueHanRespondido(new Error("Error de acceso a la base de datos"), null);
                            else {

                                amigos.forEach(function (amigo) {
                                    amigo.correct = null;
                                });

                                adivinadas.forEach(function (adivinada) {
                                    amigos.forEach(function (v, i, a) {
                                        if (v.id_user == adivinada.id_amigo) {
                                            if (adivinada.correct)
                                                v.correct = true;
                                            else
                                                v.correct = false;
                                        }
                                    })
                                })

                                cb_getAmigosQueHanRespondido(null, amigos);
                            }
                        })
                    }
                })
            }
        })
    }


    getIfAdivinada(id_pregunta, id_user, id_amigo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT correct FROM respuestas_adivinadas WHERE id_propio = ? AND id_amigo = ? AND id_pregunta = ?`;
                let elems = [id_user, id_amigo, id_pregunta];

                connection.query(sql, elems, function (err, correct) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("Acierto leído correctamente");
                        callback(null, correct[0]);
                    }
                })
            }
        })
    }


    getRespuestaPropia(id_user, id_pregunta, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT id_respuesta FROM respuestas_propias WHERE id_pregunta = ? AND id_user = ?`;
                let elems = [id_pregunta, id_user];

                connection.query(sql, elems, function (err, id_respuesta) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        console.log("Acierto leído correctamente");
                        callback(null, id_respuesta[0]);
                    }
                })
            }
        })
    }


    insertRespuestaAdivinada(id_pregunta, id_respuesta, id_amigo, id_propio, correct, vista, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {
                const sql = `INSERT INTO respuestas_adivinadas(id_pregunta, id_respuesta, id_amigo, id_propio, correct, vista) VALUES (?,?,?,?,?,?)`;
                let elems = [id_pregunta, id_respuesta, id_amigo, id_propio, correct, vista];

                connection.query(sql, elems, function (err) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {
                        console.log("Respuesta adivinada insertada correctamente");
                        callback(null);
                    }
                })
            }
        })
    }
}

function generarSentenciaInsertarRespuestas(question, elems) {
    let sql = `INSERT INTO respuestas(id_pregunta, id, texto) VALUES`;

    for (let i = 0; i < question.respuestas.length; i++) {
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