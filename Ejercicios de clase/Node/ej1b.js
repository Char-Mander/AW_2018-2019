const freplace = require("./ejnode.js");

function callback(err){
    if(err){
        console.log("Error en la lectura del fichero");
    }else{
        console.log("Todo correcto");
    }
}

console.log( freplace("fichero1.txt", /[0-9]+/g, `{numero}`, callback));