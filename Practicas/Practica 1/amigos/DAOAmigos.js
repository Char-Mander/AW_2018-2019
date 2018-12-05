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
                const sql = `INSERT INTO solicitudes (id_user1, id_user2, status, action_id_user) VALUES (?, ?, '0', ?);`;
                
                let elems = [id1, id2, id2];
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
                const sql = `DELETE FROM solicitudes WHERE id_user1=? AND id_user2=?;`;
                
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

    //Función que saca la lista de peticiones de la base de datos
    getPeticiones(id, cb_getPeticiones){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_getPeticiones(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT * FROM solicitudes WHERE id_user1 = ? AND status = 0`;
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
                const sql = `SELECT * FROM amigos WHERE id_user1 = ? OR id_user2 = ?`;

                connection.query(sql, [id, id], function(err, resultado){
                    connection.release();
                    if(err){
                        cb_getAmigos(new Error("Error de acceso a la base de datos"), null);
                    }else{
                        
                        cb_getAmigos(null, resultado);
                    }
                });
            }
        });
    }

    /* Función que busca amigos que contengan en su nombre la cadena que se le pasa a la función */
    buscarAmigos(name, cb_buscarAmigos){
        this.pool.getConnection(function(err, connection){
            if(err){
                cb_buscarAmigos(new Error("Error de conexión a la base de datos"), null);
            }else{
                const sql = `SELECT * FROM user WHERE nombre_completo LIKE ?`;
                var elem="%"+name+"%";
                connection.query(sql, [elem], function(err, resultado){
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