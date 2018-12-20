"use strict";

let carta = undefined;
let segunda = false, levantar_mas_cartas = true;
let cartasUsadas;

//  Crea el tablero del juego en base al modo de juego que elija el usuario
function crearTablero() {
    let modo = $("input[name='modo']:checked").val();

    //Borra todos los elementos, por si había uno cargado anteriormente
    cartasUsadas = [];
    $("li").remove();
    $(".imagen_adivinada").remove();
    //Reiniciamos el contador

    $(".num_clicks").find(".num").text(0);

    if (modo === "Fácil") {
        //12 cartas

        $("ul").css("grid-template-columns", "15vw 15vw 15vw 15vw 15vw 15vw").css("grid-template-rows", "15vw 15vw");

        for (let i = 1; i <= 12; i++) {
            let n = Math.floor(Math.random() * (13 - 1)) + 1;
            if (cartasUsadas.some(elem => elem == n)) {
                while (cartasUsadas.some(elem => elem == n)) {
                    n = Math.floor(Math.random() * (13 - 1)) + 1;
                }
            }

            let cartaPar = n;
            if (n % 2 == 0) {
                n = n - 1;
            }

            let carta = $(`<li class="carta${i}">
            <div class="imagen"> 
                <div class="front"><img src="./imgs/${n}.png"></div>
                <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
            cartasUsadas.push(cartaPar);
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
            let n = Math.floor(Math.random() * (25 - 1)) + 1;
            if (cartasUsadas.some(elem => elem == n)) {
                while (cartasUsadas.some(elem => elem == n)) {
                    n = Math.floor(Math.random() * (25 - 1)) + 1;
                }
            }

            let cartaPar = n;
            if (n % 2 == 0) {
                n = n - 1;
            }

            let carta = $(`<li class="carta${i}">
            <div class="imagen"> 
            <div class="front"><img src="./imgs/${n}.png"></div>
            <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
            cartasUsadas.push(cartaPar);
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
            let n = Math.floor(Math.random() * (37 - 1)) + 1;
            if (cartasUsadas.some(elem => elem == n)) {
                while (cartasUsadas.some(elem => elem == n)) {
                    n = Math.floor(Math.random() * (37 - 1)) + 1;
                }
            }

            let cartaPar = n;
            if (n % 2 == 0) {
                n = n - 1;
            }


            let carta = $(`<li class="carta${i}">
            <div class="imagen"> 
                <div class="front"><img src="./imgs/${n}.png"></div>
                <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
            cartasUsadas.push(cartaPar);
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


//  Le da la vuelta a la carta siempre que no haya dos cartas levantadas
function voltear() {
    if (levantar_mas_cartas) {
        let $front = $(this).find(".front");
        let $back = $(this).find(".back");
        $front.show();
        $back.hide();
    }

    if (segunda)
        levantar_mas_cartas = false;
}


//  Suma 1 al número de clicks del usuario
function sumarClick() {
    let num = parseInt($(".num_clicks").find(".num").text(), 10);
    
    if (levantar_mas_cartas) {

        if (num === 0)
            num = num + 1;
        else if ($(this).attr('class') !== carta.clase || carta === undefined)
            num = num + 1;

    }

    $(".num_clicks").find(".num").text(num);
}


//  Llama a la función que evalúa si las cartas son iguales pasado medio segundo
function quitar() {
    if (segunda) {
        let $otra = $(this);
        setTimeout(function () {
            quitarCarta($otra)
        }, 500)
    }
}


//  Evalúa si las dos cartas levantadas son iguales y si lo son las quita del tablero, si no, las vuelve a dar la vuelta
function quitarCarta($otra) {

    if (segunda) {  //se han levantado dos cartas

        if (carta.img === $otra.find(".front").find("img").attr('src')) {   //si ambas imágenes coinciden

            let imagen_adivinada = $(`<div class="imagen_adivinada">
            <img src="${carta.img}">
            </div>`);
            $("#imagenes_adivinadas").append(imagen_adivinada);

            $(`.${carta.clase}`).css("visibility", "hidden");
            $(`.${$otra.attr('class')}`).css("visibility", "hidden");

        } else {    //si las imágenes son distintas

            $otra.find(".front").hide();
            $otra.find(".back").show();

            carta.this.find(".front").hide();
            carta.this.find(".back").show();

        }

        carta = undefined;
        segunda = false;
        levantar_mas_cartas = true;
    }
}


//  Guarda en una variable la primera carta que se ha levantado, o bien indica que ya se han levantado dos cartas
function guardarCarta() {

    if (carta === undefined) {  //no se había clickado en ninguna carta antes
        carta = {};
        carta.img = $(this).find(".front").find("img").attr("src");
        carta.clase = $(this).attr('class');
        carta.this = $(this);
    } else if ($(this).attr('class') !== carta.clase)   //se ha clickado en dos cartas
        segunda = true;

}


$(function () {
    $("#boton_inicio").on("click", crearTablero);

    $("#lista_cartas").on("click", "li", guardarCarta);
    $("#lista_cartas").on("click", "li", sumarClick);
    $("#lista_cartas").on("click", "li", voltear);
    $("#lista_cartas").on("click", "li", quitar);
})