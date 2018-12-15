"use strict";

function crearTablero() {
    let modo = $("input[name='modo']:checked").val();

    //Borra todos los elementos, por si había uno cargado anteriormente
    $("li").remove();

    if (modo === "Fácil") {
        //12 cartas
        $("ul").css("grid-template-columns", "15vw 15vw 15vw 15vw 15vw 15vw").css("grid-template-rows", "15vw 15vw");
        
        for (let i = 1; i <= 12; i++) {
            let carta = $(`<li class="carta ${i}">
            <div class="imagen"> 
                <div class="front"><img src="./imgs.cupcake.png"></div>
                <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

        $("img").css("width", "12vw")
                .css("height", "12vw");

    } else if (modo === "Medio") {
        //24 cartas
        $("ul").css("grid-template-columns", "12vw 12vw 12vw 12vw 12vw 12vw 12vw 12vw")
                .css("grid-template-rows", "12vw 12vw 12vw");
        
        for (let i = 1; i <= 24; i++) {
            let carta = $(`<li class="carta ${i}">
            <div class="imagen"> 
            <div class="front"><img src="./imgs.cupcake.png"></div>
            <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

        $("img").css("width", "10vw")
                .css("height", "10vw");

    } else if (modo === "Difícil") {
        //36 cartas
        $("ul").css("grid-template-columns", "9vw 9vw 9vw 9vw 9vw 9vw 9vw 9vw 9vw")
                .css("grid-template-rows", "9vw 9vw 9vw 9vw");
        
        for (let i = 1; i <= 36; i++) {
            let carta = $(`<li class="carta ${i}">
            <div class="imagen"> 
                <div class="front"><img src="./imgs.cupcake.png"></div>
                <div class="back"><img src="./imgs/unicornio.png"></div>
            <div>
            </li>`);
            $("#lista_cartas").append(carta);
        }

        $("img").css("width", "7vw")
                .css("height", "7vw");

    } else {
        alert("No se ha seleccionado modo de juego");
    }

    //Oculta el div de las cartas que están bocarriba
    $("div.front").hide();
}



$(function () {

    $("#boton_inicio").on("click", crearTablero);

    $("#lista_cartas").on("click", "li", (function () {
        //let frontElems = document.getElementsByClassName("front");
        //if(frontElems.length<2){
            $("img", this).attr("src", "./imgs/cupcake.png");
            //$("div.front", this).show();
            //$("div.back", this).hide();
            /*if(frontElems.length==1){
             setTimeout(voltear, 4000);
            }*/
            //alert($(this).html());
        //}
    }))
})

function voltear() {
     $("div.front").hide();
     $("div.back").show();
}
