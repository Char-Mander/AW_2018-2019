"use strict";

let tasks=[
    {text: "Preparar práctica AW", tags: ["AW", "practica"]},
    {text: "Mirar fechas congreso", done:true, tags: []},
    {text: "Ir al supermercado", tags: ["personal"]},
    {text: "Mudanza", done: false, tags: ["personal"]}
];


/*Devuelve un array con los textos de aquellas tareas que estén sin terminar*/
function getToDoTasks(tasks){
    let resultado = [];
    let done = n => !Object.keys(n) === "done" || n["done"] === true;

    resultado = tasks.filter(n => !done(n));

    resultado = resultado.map(t => t.text);

    return resultado;
}


/*Devuelve un array con las tareas de "tasks" que contengan en su
lista de etiquetas, la etiqueta "tag".*/
function findByTag(tasks, tag){
    let list = tasks.filter(t => t.tags.some(n => n == tag));

    return list;
}


/*Devuelve un array con las tareas del array "tasks"
 que contengan al menos una etiqueta que coincida con una de las
 del array "tags".*/
function findByTags(tasks, tags){
    let list = tasks.filter(n => n.tags.some(t => tags.some(m => m == t)));

    return list;
}


/*Devuelve el número de tareas completadas en "tasks".*/
function countDone(tasks){
    let list = tasks.filter(t => t.done === true);

    return list.length;
}


/*Crea una tarea con el texto que se le pasa por parámetro, 
diferenciando entre etiquetas (que empiezan por @) y el texto de la tarea.*/
function createTask(texto){
    let task = {
        texto: "",
        tags: []
    };

    let array = texto.split(" ");
    task.texto = array.filter(n => !n.startsWith("@") && n !== "").join(" ").trim();
    task.tags = array.filter(n => n.startsWith("@"));
    task.tags = task.tags.map(t => t.slice(1, t.length));

    return task;
}

console.log(createTask("ir       al          gym          @per  @salud           por    la      tarde"));