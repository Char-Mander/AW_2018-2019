"use strict";

const mysql = require("mysql");

class DAOTasks {

    constructor(pool) {
        this.pool = pool;
    }


    /*Devuelve todas las tareas asociadas a un usuario*/
    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT task.id, task.text, task.done, tag.tag FROM task LEFT JOIN tag ON task.id = tag.taskId WHERE task.user = ?`;
                connection.query(sql, [email], function (err, filas) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else {
                        let tareas = tratarTareas(filas);
                        callback(null, tareas);
                    }
                })
            }
        })
    }


    /*Inserta una tarea en la BD asociándola a un usuario*/
    insertTask(email, task, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {
                const sql = `INSERT INTO task(id, user, text, done) VALUES (?,?,?,?)`;
                let elems = [task.id, email, task.text, task.done];
                connection.query(sql, elems, function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {

                        if (task.tags.length > 0) {
                            let elems = [];
                            let sqlEtiquetas = generarSentenciaInsertarEtiquetas(task, elems);

                            connection.query(sqlEtiquetas, elems, function (err, resultado) {
                                if (err)
                                    callback(new Error("Error de acceso a la base de datos"));
                                else {
                                    console.log("Nueva tarea insertada correctamente");
                                }
                            })
                        } else
                            console.log("Nueva tarea insertada correctamente");
                    }
                })
            }
        })
    }


    /*Marca la tarea pasada por parámetro como realizada, actualizando la base de datos*/
    markTaskDone(idTask, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {
                const sql = `UPDATE task SET done = 1 WHERE task.id = ?`;
                connection.query(sql, [idTask], function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {
                        console.log("Tarea marcada como finalizada");
                    }
                })
            }
        })
    }


    /*Elimina todas las tareas asociadas a un usuario que estén completas*/
    deleteCompleted(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
                callback(new Error("Error de conexión a la base de datos"));
            else {
                const sql = `DELETE FROM task WHERE task.user = ? AND task.done = 1`;
                connection.query(sql, [email], function (err, resultado) {
                    connection.release();
                    if (err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else {
                        console.log("Tareas finalizadas eliminadas");
                    }
                })
            }
        })
    }

}


/*Lee las filas devueltas por la consulta sql y devuelve un array de tareas*/
function tratarTareas(filas) {
    let tareas = [];

    for (let f = 0; f < filas.length; f++) {
        let tarea = {};

        if (tareas.some(n => n.id === filas[f].id)) { //si esa tarea ya se ha insertado 
            let t = tareas.filter(n => n.id === filas[f].id);   //se busca en el array
            t[0].tags.push(filas[f].tag); //se añade la nueva etiqueta a su array de etiquetas
        } else {  //si no está en el array, se crea un objeto nuevo y se inserta
            tarea.id = filas[f].id;
            tarea.text = filas[f].text;
            tarea.done = filas[f].done;
            tarea.tags = [];
            if (filas[f].tag !== null)
                tarea.tags.push(filas[f].tag);

            tareas.push(tarea);
        }   
    }

    return tareas;
}


/*Genera la sentencia sql para insertar las etiquetas de las tareas en la base de datos*/
function generarSentenciaInsertarEtiquetas(task, elems) {
    let sqlEtiquetas = `INSERT INTO tag(taskId, tag) VALUES`;

    for (let i = 0; i < task.tags.length; i++) {
        sqlEtiquetas += `(?,?)`;
        elems.push(task.id);
        elems.push(task.tags[i]);

        if (i < task.tags.length - 1)
            sqlEtiquetas += `,`;
    }

    return sqlEtiquetas;
}


module.exports = DAOTasks;