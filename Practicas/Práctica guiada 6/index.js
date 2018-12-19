"use strict";

let imagenes = [];

//  Crea el tablero del juego en base al modo de juego que elija el usuario
function crearTablero() {
    let modo = $("input[name='modo']:checked").val();

    //Borra todos los elementos, por si había uno cargado anteriormente
    $("li").remove();
    $(".imagen_adivinada").remove();
    //Reiniciamos el contador

    $(".num_clicks").find(".num").text(0);
    $(".num_clicks").find(".consultar_clicks").text(0);

    if (modo === "Fácil") {
        //12 cartas
        $("ul").css("grid-template-columns", "15vw 15vw 15vw 15vw 15vw 15vw").css("grid-template-rows", "15vw 15vw");

        for (let i = 1; i <= 12; i++) {
            let carta = $(`<li class="carta${i}">
            <div class="imagen"> 
                <div class="front"><img src="./imgs/cupcake.png"></div>
                <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

        $(".front img").css("width", "12vw")
            .css("height", "12vw");
        $(".back img").css("width", "12vw")
            .css("height", "12vw");

        $(".imagenes_adivinadas").css("grid-template-columns", "2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw")
            .css("grid-template-rows", "2.8vw");
    } else if (modo === "Medio") {
        //24 cartas
        $("ul").css("grid-template-columns", "12vw 12vw 12vw 12vw 12vw 12vw 12vw 12vw")
            .css("grid-template-rows", "12vw 12vw 12vw");

        for (let i = 1; i <= 24; i++) {
            let carta = $(`<li class="carta${i}">
            <div class="imagen"> 
            <div class="front"><img src="./imgs/cupcake.png"></div>
            <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

        $(".front img").css("width", "10vw")
            .css("height", "10vw");
        $(".back img").css("width", "10vw")
            .css("height", "10vw");

            $(".imagenes_adivinadas").css("grid-template-columns", "2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw")
            .css("grid-template-rows", "2.8vw");
    } else if (modo === "Difícil") {
        //36 cartas
        $("ul").css("grid-template-columns", "9vw 9vw 9vw 9vw 9vw 9vw 9vw 9vw 9vw")
            .css("grid-template-rows", "9vw 9vw 9vw 9vw");

        for (let i = 1; i <= 36; i++) {
            let carta = $(`<li class="carta${i}">
            <div class="imagen"> 
                <div class="front"><img src="./imgs/cupcake.png"></div>
                <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

        $(".front img").css("width", "7vw")
            .css("height", "7vw");
        $(".back img").css("width", "7vw")
            .css("height", "7vw");
            
        $(".imagenes_adivinadas").css("grid-template-columns", "2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw 2.8vw")
            .css("grid-template-rows", "2.8vw 2.8vw");

    } else {
        alert("No se ha seleccionado modo de juego");
    }

    //Oculta el div de las cartas que están bocarriba
    $(".front").hide();
}

//  Da la vuelta a las cartas, y las devuelve a su posición inicial tras un segundo
function voltear() {
    let num = parseInt($(".num_clicks").find(".consultar_clicks").text(), 10);
    if (num < 2) {
        let $front = $(this).find(".front");
        let $back = $(this).find(".back");
        $front.show();
        $back.hide();


        setTimeout(function () {
            voltearCarta($front, $back);
        }, 4000);
    }
    /*else if (num ==2){
        setTimeout(function () {
                    voltearCarta($front, $back);
                }, 4000);
    }*/
}

function voltearCarta(front, back) {
    $(".num_clicks").find(".consultar_clicks").text(0);
    front.hide();
    back.show();
}

//  Suma 1 al número de clicks del usuario
function sumarClick() {
    let num = parseInt($(".num_clicks").find(".num").text(), 10);
    let num_comprobar_clicks = parseInt($(".num_clicks").find(".consultar_clicks").text(), 10);
    num = num + 1;
    num_comprobar_clicks = num_comprobar_clicks + 1;

    $(".num_clicks").find(".num").text(num);
    $(".num_clicks").find(".consultar_clicks").text(num_comprobar_clicks);
}


$(function () {
    $("#boton_inicio").on("click", crearTablero);

    $("#lista_cartas").on("click", "li", voltear);
    $("#lista_cartas").on("click", "li", sumarClick);
    $("#lista_cartas").on("click", "li", guardarCarta);
    $("#lista_cartas").on("click", "li", quitarCarta);

})

function guardarCarta() {
    let $carta = {};

    $carta.img = $(this).find(".front").find("img").attr("src");
    $carta.clase = $(this).attr('class');

    imagenes.push($carta);
}

function quitarCarta() {
    let $carta1, $carta2;
    if (imagenes.length >= 2) {
        $carta1 = imagenes.shift();
        $carta2 = imagenes.shift();

        if ($carta1.img === $carta2.img) {
            //Se muestra la imagen adivinada arriba a la derecha
            let imagen_adivinada = $(`<div class="imagen_adivinada">
            <img src="./imgs/cupcake.png">
            </div>`);
            $("#imagenes_adivinadas").append(imagen_adivinada);

            $(`.${$carta1.clase}`).css("visibility", "hidden");
            $(`.${$carta2.clase}`).css("visibility", "hidden");
        }

    }
}
