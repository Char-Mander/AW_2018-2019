"use strict";

class DAOAmigos{
    constructor(pool) {
        this.pool = pool;
    }

    //Función que añade una petición a la lista de peticiones
    insertPeticiones(id1, id2, cb_insertPeticiones){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_insertPeticiones(new Error("Error de conexión a la base de datos"));
            }else{
                const sql = `INSERT INTO solicitudes (id_user1,  action_id_user) VALUES (?, ?);`;
                
                let elems = [id1, id2];
                connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        cb_insertPeticiones(new Error("Error de acceso a la base de datos"));
                    }else{
                        cb_insertPeticiones(null);
                    }
                });
            }
        });    
    }

    //Función que elimina las peticiones completadas
    peticionDone(id1, id2, cb_peticionesDone){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_peticionesDone(new Error("Error de conexión a la base de datos"));
            }else{
                const sql = `DELETE FROM solicitudes WHERE id_user1=? AND action_id_user=?;`;
                
                let elems = [id1, id2];
                connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        cb_peticionesDone(new Error("Error de acceso a la base de datos"));
                    }else{
                        cb_peticionesDone(null);
                    }
                });
            }
        });
    }

    //Función que saca la lista de peticiones de la base de datos
    getPeticiones(id, cb_getPeticiones){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getPeticiones(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT id_user, nombre_completo, imagen_perfil FROM user LEFT JOIN solicitudes ON action_id_user = id_user
                WHERE id_user1 = ?`;
                connection.query(sql, [id], function(err, resultado){
                    connection.release();
                    if(err){
                        cb_getPeticiones(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        cb_getPeticiones(null, resultado);
                    }
                });
            }
        });
    }

    //Añade usuarios a la lista de amigos
    insertAmigos(id1, id2, cb_insertAmigos){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_insertAmigos(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `INSERT INTO amigos (id_user1, id_user2) VALUES (?, ?);`;
                const elems = [id1, id2];
                connection.query(sql, elems, function(err, resultado){
                    connection.release();
                    if(err){
                        cb_insertAmigos(new Error("Error de acceso a la base de datos"));
                    }else{
                        cb_insertAmigos(null);
                    }
                });
            }
        });
    }

    //Función que saca la lista de amigos de la base de datos
    getAmigos(id, cb_getAmigos){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getAmigos(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT id_user, nombre_completo, imagen_perfil FROM user LEFT JOIN amigos ON id_user1 = id_user OR id_user2 = id_user 
                WHERE (id_user1 = ? AND id_user2 = id_user) OR (id_user2 = ? AND id_user1 = id_user)`;

                connection.query(sql, [id, id, id], function(err, resultado){
                    connection.release();
                    if(err){
                        console.log("Error en la consulta");
                        cb_getAmigos(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        
                        cb_getAmigos(null, resultado);
                    }
                });
            }
        });
    }

    /* Función que busca amigos que contengan en su nombre la cadena que se le pasa a la función */
    buscarAmigos(id, name, cb_buscarAmigos){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_buscarAmigos(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT * FROM user WHERE id_user != ? AND nombre_completo LIKE ? 
                AND id_user NOT IN (SELECT id_user FROM user LEFT JOIN solicitudes ON id_user = id_user1 OR id_user = action_id_user 
                    WHERE id_user1 = ? OR action_id_user = ?) 
                AND id_user NOT IN (SELECT id_user FROM user LEFT JOIN amigos ON id_user = id_user1 OR id_user = id_user2 
                    WHERE id_user1 = ? OR id_user2 = ?)`;
                
                var elem=[id, "%"+name+"%", id, id, id, id];
                connection.query(sql, elem, function(err, resultado){
                    connection.release();
                    if(err){
                        cb_buscarAmigos(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        
                        cb_buscarAmigos(null, resultado);
                    }
                });
            }
        });
    }



}   


module.exports = DAOAmigos;