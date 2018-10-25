"use strict";

let listaTareas=[
                {text: "Preparar práctica AW", tags: ["AW", "practica"]},
                {text: "Mirar fechas congreso", done:true, tags: []},
                {text: "Ir al supermercado", tags: ["personal"]},
                {text: "Mudanza", done: false, tags: ["personal"]}
];




function getToDoTasks(tasks){
    let resultado=[];
    let done= n => !Object.keys(n)==="done" || n["done"]===true;

    resultado=tasks.filter(n => !done(n));

    return resultado;
}
