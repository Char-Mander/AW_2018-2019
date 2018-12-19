"use strict";

let cartas = [];
let carta = undefined;
let segunda = false;
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
    $(".num_clicks").find(".consultar_clicks").text(0);

    if (modo === "Fácil") {
        //12 cartas

        $("ul").css("grid-template-columns", "15vw 15vw 15vw 15vw 15vw 15vw").css("grid-template-rows", "15vw 15vw");

        for (let i = 1; i <= 12; i++) {
            let n = Math.floor(Math.random() * (13 - 1)) + 1;
            if(cartasUsadas.some(elem => elem == n)){
                while(cartasUsadas.some(elem => elem == n)){
                    n = Math.floor(Math.random() * (13 - 1)) + 1;
                }
            }
           
            let cartaPar = n;
            if(n%2==0){
                n=n-1;
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
            if(cartasUsadas.some(elem => elem == n)){
                while(cartasUsadas.some(elem => elem == n)){
                    n = Math.floor(Math.random() * (25 - 1)) + 1;
                }
            }

            let cartaPar = n;
            if(n%2==0){
                n=n-1;
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
            if(cartasUsadas.some(elem => elem == n)){
                while(cartasUsadas.some(elem => elem == n)){
                    n = Math.floor(Math.random() * (37 - 1)) + 1;
                }
            }

            let cartaPar = n;
            if(n%2==0){
                n=n-1;
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

//  Da la vuelta a las cartas, y las devuelve a su posición inicial tras un segundo
/*function voltear() {
    let num = parseInt($(".num_clicks").find(".consultar_clicks").text(), 10);
    console.log("Número de clicks: " + num);
    if (num <= 2) {
        let $front = $(this).find(".front");
        let $back = $(this).find(".back");
        $front.show();
        $back.hide();

        if (num == 2) {
            setTimeout(function () {
                voltearCarta();
            }, 2000);
        }
    }
}*/

function voltear() {
    let $front = $(this).find(".front");
    let $back = $(this).find(".back");
    $front.show();
    $back.hide();
}

function voltearCarta() {
    $(".num_clicks").find(".consultar_clicks").text(0);
    $("div.front").hide();
    $("div.back").show();
}

//  Suma 1 al número de clicks del usuario
function sumarClick() {
    let num = parseInt($(".num_clicks").find(".num").text(), 10);
    let num_comprobar_clicks = parseInt($(".num_clicks").find(".consultar_clicks").text(), 10);
    //let carta = cartas.shift();

    if (num === 0) {
        num_comprobar_clicks = num_comprobar_clicks + 1;
        num = num + 1;

    } else if ($(this).attr('class') !== carta.clase || carta === undefined) {
        num_comprobar_clicks = num_comprobar_clicks + 1;
        num = num + 1;
    }

    //cartas.push(carta);
    $(".num_clicks").find(".num").text(num);
    $(".num_clicks").find(".consultar_clicks").text(num_comprobar_clicks);
}


$(function () {
    $("#boton_inicio").on("click", crearTablero);

    $("#lista_cartas").on("click", "li", guardarCarta);
    $("#lista_cartas").on("click", "li", sumarClick);
    $("#lista_cartas").on("click", "li", voltear);
    $("#lista_cartas").on("click", "li", quitar);
})

function quitar() {
    if (segunda) {
        console.log("this en quitar: " + $(this));
        let $otra = $(this);
        setTimeout(function () {
            console.log("this en setimeout: " + $(this));
            quitarCarta($otra)
        }, 2000)
    }
}

function quitarCarta($otra) {
    console.log("Carta en quitarCarta: " + carta);
    console.log($otra.attr('class'));

    if (segunda) {

        if (carta !== undefined && $otra.attr('class') !== carta.clase) {
            console.log(carta.img);
            console.log($otra.find(".front").find("img").attr('src'));
            if (carta.img === $otra.find(".front").find("img").attr('src')) {
                console.log("Imagenes iguales");
                let imagen_adivinada = $(`<div class="imagen_adivinada">
            <img src="${carta.img}">
            </div>`);
                $("#imagenes_adivinadas").append(imagen_adivinada);

                $(`.${carta.clase}`).css("visibility", "hidden");
                $(`.${$otra.attr('class')}`).css("visibility", "hidden");
            } else {
                console.log("Imágenes distintas");

                /*let $front = $otra.find(".front");
                let $back = $otra.find(".back");
                $front.hide();
                $back.show();*/

                $otra.find(".front").hide();
                $otra.find(".back").show();

                let $front2 = carta.this.find(".front");
                let $back2 = carta.this.find(".back");
                $front2.hide();
                $back2.show();
            }
        }

        carta = undefined;
        segunda = false;
    }
}

/*function guardarCarta() {
    let $carta = {};

    $carta.img = $(this).find(".front").find("img").attr("src");
    $carta.clase = $(this).attr('class');

    if (cartas.length > 0) {
        let $otra = cartas.shift();

        if ($otra.clase === $carta.clase)
            cartas.push($otra);
        else {
            cartas.push($otra);
            cartas.push($carta);
        }
    } else {
        cartas.push($carta);
    }

    console.log("Cartas después de guardarCarta: ");
    for (let i = 0; i < cartas.length; ++i)
        console.log(`${cartas[i].clase}`);
}*/

function guardarCarta() {
    console.log("Carta clickada: " + carta);
    if (carta === undefined) {
        carta = {};
        carta.img = $(this).find(".front").find("img").attr("src");
        carta.clase = $(this).attr('class');
        carta.this = $(this);
    } else if ($(this).attr('class') !== carta.clase)
        segunda = true;

}

/*function quitarCarta() {
    let $carta1, $carta2;
    if (cartas.length >= 2) {
        $carta1 = cartas.shift();
        $carta2 = cartas.shift();

        if ($carta1.img === $carta2.img && $carta1.clase !== $carta2.clase) {
            //Se muestra la imagen adivinada arriba a la derecha
            let imagen_adivinada = $(`<div class="imagen_adivinada">
            <img src="${$carta1.img}">
            </div>`);
            $("#imagenes_adivinadas").append(imagen_adivinada);

            $(`.${$carta1.clase}`).css("visibility", "hidden");
            $(`.${$carta2.clase}`).css("visibility", "hidden");
        }

    }
}*/
