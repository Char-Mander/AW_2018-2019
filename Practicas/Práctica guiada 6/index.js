"use strict";

function crearTablero() {
    let modo = $("input[name='modo']:checked").val();


    $("li").remove();

    if (modo === "Fácil") {
        alert("Modo de juego: " + modo);
        for (let i = 1; i <= 12; i++) {
            let carta = $(`<li class="carta ${i}">
            <div class="imagen"> 
                <img src="./imgs/unicornio.png">
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }
        //12 cartas
    } else if (modo === "Medio") {
        //24 cartas
        for (let i = 1; i <= 24; i++) {
            let carta = $(`<li class="carta ${i}">
            <div class="imagen"> 
                <img src="./imgs/unicornio.png">
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

    } else if (modo === "Difícil") {
        //36 cartas
        for (let i = 1; i <= 36; i++) {
            let carta = $(`<li class="carta ${i}">
            <div class="imagen"> 
                <img src="./imgs/unicornio.png">
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

    } else {
        alert("No se ha seleccionado modo de juego");
    }
}



$(function () {

    $("#boton_inicio").on("click", crearTablero);

    $("#lista_cartas").on("click", "li", (function () {
        $("img", this).attr("src", "./imgs/cupcake.png");
        // setTimeout(voltear, 4000);
        //alert($(this).html());
    }))
})

function voltear() {
    // $("img", this).attr("src", "./imgs/unicornio.png");

}
