"use strict";

const fs = require("fs");
let texto;

fs.readFile("fichero1.txt", {encoding: "utf-8"},
function(err, contenido){
    if(err){
        console.log("Ha habido un error en la lectura del fichero.");
    }else{
        console.log("Fichero leído correctamente");
        texto = contenido;
        texto = texto.replace(/\s+/g, " "); //Reemplaza los grupos de uno o más espacios en blanco por un único espacio en blanco

        fs.writeFile("resultado.txt", texto, {encoding: "utf-8"},
        function(err){
            if(err){
                console.log("Error en la escritura del fichero.");
            }else{
                console.log("Contenido del fichero resultado: " + texto);
            }
        })
    }
})
