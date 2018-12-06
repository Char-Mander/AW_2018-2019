"use strict";

class DAOPreguntas {

    constructor(pool) {
        this.pool = pool;
    }

    /*Inserta un usuario en la base de datos y, si no ha habido error, devuelve el objeto que representa el usuario*/
    insertQuestion(question, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                callback(new Error("Error de conexión a la base de datos"));
            }else{

                const sql = `INSERT INTO preguntas(id, texto) VALUES (?,?)`
                let elems = [question.id, question.texto];

                connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        callback(new Error("Error en el proceso de registro"));
                    }else{
                        question.id = resultado.insertId;
                        let elems = [];
                        let sqlRespuestas = generarSentenciaInsertarRespuestas(question, elems);

                        connection.query(sqlRespuestas, elems, function (err, resultado) {
                            if (err)
                                callback(new Error("Error de acceso a la base de datos"));
                            else {
                                console.log("Nueva pregunta insertada correctamente");
                                callback(null);
                            }
                        });
                    }
                 });
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
}

function generarSentenciaInsertarRespuestas(question, elems){
    let sql = `INSERT INTO respuestas_propuestas(id_pregunta, id, texto, correct) VALUES`;

    for(let i = 0; i < question.respuestas.length; i++){
        sql += `(?,?,?,?)`;
        elems.push(question.id);
        elems.push(question.respuestas[i].id);
        elems.push(question.respuestas[i]);
        elems.push(question.correctos[i]);

        if (i < question.respuestas.length - 1)
            sql += `,`;
    }

    return sql;
}

module.exports = DAOPreguntas;