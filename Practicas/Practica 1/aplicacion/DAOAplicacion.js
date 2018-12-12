"use strict";

class DAOAplicacion{
    constructor(pool) {
        this.pool = pool;
    }

    getListadoNotificaciones(id_user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
            callback(new Error("Error de conexión a la base de datos"), null);
            else {
                const sql = `SELECT us.id_user, nombre_completo, imagen_perfil, res_ad.id_pregunta, res_ad.id_respuesta, res_ad.correct, res_ad.vista, res.texto AS texto_respuesta, pre.texto AS texto_pregunta, res_p.texto AS respuesta_correcta 
                FROM user us
                LEFT JOIN amigos ON id_user1 = us.id_user 
                LEFT JOIN respuestas_adivinadas res_ad ON us.id_user=res_ad.id_propio 
                LEFT JOIN respuestas res ON res_ad.id_respuesta = res.id 
                LEFT JOIN preguntas pre ON res_ad.id_pregunta = pre.id
                LEFT JOIN respuestas_propias res_p ON res_p.id_user = res_ad.id_amigo
                WHERE id_user2 = ? AND id_user2 = res_ad.id_amigo AND res_ad.vista = '0' AND res_ad.id_pregunta = res.id_pregunta AND res_ad.id_pregunta = res_p.id_pregunta
                
                UNION
                
                SELECT us.id_user, nombre_completo, imagen_perfil, res_ad.id_pregunta, res_ad.id_respuesta, res_ad.correct, res_ad.vista, res.texto AS texto_respuesta, pre.texto AS texto_pregunta, res_p.texto AS respuesta_correcta 
                FROM user us 
                LEFT JOIN amigos ON id_user2 = us.id_user
                LEFT JOIN respuestas_adivinadas res_ad ON us.id_user=res_ad.id_propio 
                LEFT JOIN respuestas res ON res_ad.id_respuesta = res.id 
                LEFT JOIN preguntas pre ON res_ad.id_pregunta = pre.id
                LEFT JOIN respuestas_propias res_p ON res_p.id_user = res_ad.id_amigo
                LEFT JOIN respuestas_adivinadas ON us.id_user = res_ad.id_propio
                WHERE id_user1 = ? AND id_user1 = res_ad.id_amigo AND res_ad.vista = '0' AND res_ad.id_pregunta = res.id_pregunta AND res_ad.id_pregunta = res_p.id_pregunta`;

                const elems = [id_user, id_user];
                connection.query(sql, elems, function (err, listado) {
                    connection.release();
                    if (err)
                    callback(new Error("Error de acceso a la base de datos en el getListadoNotificaciones"), null);
                    else {
                        console.log("Respuestas leídas correctamentes");
                        callback(null, listado);
                    }
                })
            }
        })
    }

    actualizarNotificaciones(id_user, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err)
            callback(new Error("Error de conexión a la base de datos en el actualizar notificaciones"), null);
            else {
                const sql = `UPDATE respuestas_adivinadas SET vista = '1' WHERE id_amigo = ?`;

                const elems = [id_user];
                connection.query(sql, elems, function (err) {
                    connection.release();
                    if (err)
                    callback(new Error("Error de acceso a la base de datos"));
                    else {
                        console.log("Notificaciones actualizadas correctamentes");
                        callback(null);
                    }
                })
            }
        })
    }

   
}   


module.exports = DAOAplicacion;