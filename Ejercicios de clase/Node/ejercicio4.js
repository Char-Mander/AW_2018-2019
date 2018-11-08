"use strict";

const mysql = require("mysql");

/*Creación de un pool de conexiones*/
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "Articulos"
});

/*Obtención de una conexión del pool*/
pool.getConnection(function(err, connection){
    if(err)
        console.log(`Error al obtener la conexión: ${err.message}`);
    else{
        connection.query("SELECT * FROM articulos", function(err, articulos){
            connection.release();
            if(err)
                console.log(`Error en la consulta a la base de datos: ${err.message}`);
            else{
                tratarArticulos(articulos);
            }
        })
    }
});

/*Función que trata los artículos obtenidos de la consulta a la base de datos*/
function tratarArticulos(articulos){
    let resultado = [];

    /*Por cada artículo leído, se crea un nuevo objeto al que se le asignan los atributos del artículo*/
    for(let i = 0; i < articulos.length; i++){
        let articulo = {};
        articulo.id = articulos[i].Id;
        articulo.titulo = articulos[i].Titulo;
        articulo.fecha = articulos[i].Fecha;
        articulo.palabrasClave = listaPalabrasClave(articulo.id);
 
        resultado.push(articulo);
    }

    console.log(resultado); // Array con los artículos leídos de la consulta
}

/*Realiza una consulta a la base de datos para obtener la lista de palabras clave de un artículo*/
function listaPalabrasClave(IdArticulo){
    let palabrasClave = [];
    pool.getConnection(function(err, connection){
        if(err)
            console.log(`Error al obtener la conexión: ${err.message}`);
        else{
            connection.query(`SELECT PalabraClave FROM palabrasclave WHERE IdArticulo = ?`, [IdArticulo], function(err, palabras){
                connection.release();
                if(err)
                    console.log(`Error en la consulta a la base de datos: ${err.message}`);
                else{
                    for(let i = 0; i < palabras.length; i++){
                        let p = "";
                        p = palabras[i].PalabraClave;
                        palabrasClave.push(p);
                    }
                }
            })
        }
    });

    return palabrasClave;
}