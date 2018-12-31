"use strict";

// loadTasks(); Solicita al servidor la lista de tareas (mediante una petición AJAX) e inserta cada una de ellas en el DOM para que se 
// visualicen en la página.
function loadTasks() {
    $.ajax({
        method: "GET",
        url: "/tasks",

        success: function (data, textStatus, jqXHR) {
            data.forEach((task) => {

                let tarea = taskToDOMElement(task);
                $('#tareas').append(tarea);
            })
        },

        error: function (jqXHR, testStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}


// taskToDOMElement(task); A partir de un objeto con dos atributos (id y text) representando la información de una tarea, 
// construye un elemento <x> con el contenido de dicha tarea y devuelve una selección al mismo. Este elemento contiene, 
// además, un atributo personalizado con el identificador de la tarea. En esta descripción, <x> representa el elemento
// HTML que se haya utilizado para representar cada tarea en el fichero tasks.html.
function taskToDOMElement(task) {
    let x = '<li id="tarea_' + task.id + '" > <div class="st"><div class="nombre"><h3>' + task.text + '</h3> </div> <div class="marcar" id="botón"> <button class="button" id="botón_eliminar_tarea"> Eliminar </button> </div> </div> </li>';
    $("#tarea_" + task.id + "").data("id_tarea", task.id);
   // console.log(task.id + " " + task.text);
    return x;
}




// onAddButtonClick(event) Maneja los eventos de clic en el botón [Añadir]. Debe obtener la cadena introducida en el 
// cuadro de texto situado a la izquierda de dicho botón. Si esta cadena es no vacía, realizará una petición AJAX al 
// servidor para insertar la tarea en la lista de tareas. Además, debe añadir el elemento del DOM correspondiente.
function onAddButtonClick(event){

    $.ajax({
        method: "POST",
        url: "/tasks",

        success: function (data) {
            //Se añade la tarea al DOM
            let tarea = taskToDOMElement(data);
            $('#tareas').append(tarea);
        },

        error: function (jqXHR, testStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });

    event.preventDefault();
}


// Manejador de inicialización del DOM, que se limita a llamar a la función loadTasks() y a asignar sendos manejadores de eventos a 
// los botones [Eliminar] y al botón [Añadir] de la página. 
$(function () {
    $(loadTasks());
    $("#botón").on("click", "button", onRemoveButtonClick);
    $("#botón_añadir_tarea").on("click", onAddButtonClick);

});

// onRemoveButtonClick(event) Maneja los eventos de clic en un botón [Eliminar]. Debe enviar una petición AJAX para 
// eliminar la tarea correspondiente del servidor y eliminar dicha tarea del DOM.
function onRemoveButtonClick(event){
    let id_tarea = $(event.target).data("id_tarea");

    $.ajax({
        method: "DELETE",
        url: "/tasks/" + id_tarea,

        success: function (data) {
            //  Hay que borrar la tarea del DOM
            $("#tarea_" + id_tarea + "").remove();
        },

        error: function (jqXHR, testStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });

    event.preventDefault();
}



