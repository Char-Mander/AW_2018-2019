"use strict";

const mysql = require("mysql");

class DAOTasks{

    constructor(pool){
        this.pool = pool;
    }

    /*Devuelve todas las tareas asociadas a un usuario*/
    getAllTasks(email, callback){
        let tareas = [];

        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"), null);
            else{
                const sql = `SELECT id, text, done, tag FROM task JOIN tag WHERE tag.taskId = task.id AND task.id = ?`;
                connection.query(sql, [email], function(err, filas){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"), null);
                    else{
                        tratarTareas(filas, tareas);
                        callback(null, tareas);
                    }
                })
            }
        })
    }

    tratarTareas(filas, tareas){
        let resultado = [];
        for(let f = 0; f < filas.length; f++){
            let tarea = {};
            if(resultado.some(n => n.id === f.id)){ //Si esa tarea ya se ha insertado 
                let t = resultado.filter(n => n.id === f.id);   //Se busca en el array
                t.tags.push(f.tag); //se añade la nueva etiqueta a su array de etiquetas
            }else{  //Si no está en el array, se crea un objeto nuevo y se inserta
                tarea.id = f.id;
                tarea.text = f.text;
                tarea.done = f.done;
                tarea.tags = [];
                tarea.tags.push(f.tag);
            }

            resultado.push(tarea);
        }
        tareas = resultado;
    }


    insertTask(email, task, callback){
        let sqlEtiquetas = "";
        let elems = [];
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"));
            else{
                const sql = `INSERT INTO task(id, user, text, done) VALUES (?,?,?,?)`;
                connection.query(sql, [task.id, email, task.text, task.done], function(err, resultado){
                    connection.release();
                    if(err)
                    callback(new Error("Error de acceso a la base de datos"));
                    else{
                        elems = construirSentenciaInsercionEtiquetas(task.tags, sqlEtiquetas);
                        connection.query(sqlEtiquetas, elems, function(err, resultado){
                            if(err)
                                callback(new Error("Error de acceso a la base de datos"));
                            else{
                                console.log("Nueva tarea insertada correctamente");
                            }
                        })
                    }
                })
            }
        })
    }


    construirSentenciaInsercionEtiquetas(tags, sql){
        sql = `INSERT INTO tag(taskId, tag) VALUES`;
        let array = [];

        for(let i = 0; i < tags.length; i++){
            sql += `(?,?)`;
            array.push(tags[i].id);
            array.push(tags[i].tag);
        }

        return array;
    }


    markTaskDone(idTask, callback){
        this.pool.getConnection(function(err, connection){
            if(err)
                callback(new Error("Error de conexión a la base de datos"));
            else{
                const sql = ``;
                connection.query(sql, [], function(err, resultado){
                    connection.release();
                    if(err)
                        callback(new Error("Error de acceso a la base de datos"));
                    else{
                        console.log("Tarea marcada como finalizada");
                    }
                })
            }
        })
    }

}

modules.export = DAOTasks;