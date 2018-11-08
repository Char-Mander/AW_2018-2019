"use strict";

const fs = require("fs");
let texto; 

function freplace(fichero, buscar, sustituir, callback) {
    fs.readFile(fichero, { encoding: "utf-8" },
        function (err, contenido) {
            if (err) {
                callback(err);
            } else {
                callback(null);
                texto = contenido;
                texto = texto.replace(buscar, sustituir);

                fs.writeFile(fichero, texto, { encoding: "utf-8" },
                    function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    })
            }
        });
}



module.exports = freplace;