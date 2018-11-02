"use strict";

/*EJERCICIO 1*/
function producto(x, y) {
    if (typeof (x) == "number" && typeof (y) == "number")
        return x * y;

    if (x instanceof Array && y instanceof Array)
        return multiplicarDosArrays(x, y);

    if (x instanceof Array && typeof (y) == "number")
        return multiplicarNumeroPorArray(y, x);

    if (typeof (x) == "number" && y instanceof Array)
        return multiplicarNumeroPorArray(x, y);

    throw new Error("El tipo de los datos es incorrécto.");
}

function multiplicarDosArrays(a1, a2) {
    let resultado = [];

    if (a1.length == a2.length)
        for (let i = 0; i < a1.length; i++)
            resultado[i] = a1[i] * a2[i];
    else
        throw Error("No se puede multiplicar dos arrays de distinto tamaño.");

    return resultado;
}

function multiplicarNumeroPorArray(n, a) {
    let resultado = [];

    for (let i = 0; i < a.length; i++)
        resultado[i] = a[i] * n;

    return resultado;
}



/*EJERCICIO 2a*/
function suma(x) { return x + 1; }
function resta(x) { return x - 1; }
function cuadrado(x) { return x * x; }
function mas_dos(x) { return x + 2; }

let funs = [suma, resta, cuadrado, mas_dos];

function sequence1(num, funs) {
    let resultado = 0;

    for (let i = 0; i < funs.length; i++)
        if (i == 0)
            resultado = funs[i](num);
        else
            resultado = funs[i](resultado);

    return resultado;
}

//console.log(sequence1(4, funs));    //Muestra 18


/*EJERCICIO 2b*/
function sequence2(num, funs) {
    let resultado = 0;

    for (let i = 0; i < funs.length && typeof (resultado) != "undefined"; i++)
        if (i == 0)
            resultado = funs[i](num);
        else
            resultado = funs[i](resultado);

    return resultado;
}

//console.log(sequence2(4, funs));    //Muestra 18, a no ser que alguna función devuelva "undefined"


/*EJERCICIO 2c*/
function sequence3(num, funs, right) {
    let resultado = 0;

    if (!right)
        for (let i = 0; i < funs.length && typeof (resultado) != "undefined"; i++)
            if (i == 0)
                resultado = funs[i](num);
            else
                resultado = funs[i](resultado);
    else
        for (let j = funs.length - 1; j >= 0 && typeof (resultado) != "undefined"; j--)
            if (j == funs.length - 1)
                resultado = funs[j](num);
            else
                resultado = funs[j](resultado);

    return resultado;
}

//console.log(sequence3(4, funs, true));  //Muestra 36, a no ser que alguna función devuelve "undefined"



/*EJERCICIO 3a*/
let personas = [
    { nombre: "Ricardo", edad: 63 },
    { nombre: "Paco", edad: 55 },
    { nombre: "Enrique", edad: 32 },
    { nombre: "Adrián", edad: 34 }
];

function pluck(objects, fieldName) {
    let resultado = [];

    for (let i = 0; i < objects.length; i++)
        if (typeof (objects[i][fieldName]) != "undefined")
            resultado[i] = objects[i][fieldName];

    return resultado;
}

//console.log(pluck(personas, "nombre"));   // Muestra: ["Ricardo", "Paco", "Enrique", "Adrián"]
//console.log(pluck(personas, "edad")); // Muestra: [63, 55, 32, 34]



/*EJERCICIO 3b*/
function partition(array, p) {
    let resultado = [[], []];

    for (let i = 0; i < array.length; i++)
        if (p(array[i]))
            resultado[0][i] = array[i];
        else
            resultado[1][i] = array[i];

    return resultado;
}

let resultado = partition(personas, pers => pers.edad >= 60);
//Devuelve: [ [ {nombre: "Ricardo", edad: 63} ], 
//            [ {nombre: "Paco", edad: 55}, {nombre: "Enrique", edad: 32}, {nombre: "Adrián", edad: 34} ]
//          ]



/*EJERCICIO 3c*/
function groupBy(array, f) {
    let resultado = {};

    for (let i = 0; i < array.length; i++) {
        if (typeof (resultado[f(array[i])]) == "undefined")
            resultado[f(array[i])] = [];

        resultado[f(array[i])].push(array[i]);
    }

    return resultado;
}

let res = groupBy(["Mario", "Elvira", "María", "Estela", "Fernando"], str => str[0]);
// Devuelve el objeto: { "M" : ["Mario", "María"], "E" : ["Elvira", "Estela"], "F" : ["Fernando"] } 



/*EJERCICIO 3d*/
function where(array, modelo) {
    let resultado = [];
    let atributos = Object.keys(modelo);
    let ok = true;

    for (let i = 0; i < array.length; i++) {
        ok = true;
        for (let j = 0; j < atributos.length && ok; j++)
            ok = (atributos[j] in array[i] && modelo[atributos[j]] === array[i][atributos[j]]);

        if (ok)
            resultado.push(array[i]);
    }

    return resultado;
}

let res1 = where(personas, { edad: 55 });   // Devuelve [ { nombre: 'Paco', edad: 55 } ]
let res2 = where(personas, { nombre: "Adrián" });   // Devuelve [ { nombre: 'Adrián', edad: 34 } ]
let res3 = where(personas, { nombre: "Adrián", edad: 21 }); // Devuelve []



/*EJERCICIO 4*/
function pluckOrdenSuperior(objects, fieldName) {
    let resultado = objects.map(n => n[fieldName]);

    return resultado;
}

//console.log(pluckOrdenSuperior(personas, "nombre")) // Devuelve: ["Ricardo", "Paco", "Enrique", "Adrián"]
//console.log(pluckOrdenSuperior(personas, "edad")) // Devuelve: [63, 55, 32, 34]



function partitionOrdenSuperior(array, p) {
    let resultado = [[], []];

    resultado[0] = array.filter(n => p(n));
    resultado[1] = array.filter(n => !p(n));

    return resultado;
}

//console.log(partitionOrdenSuperior(personas, pers => pers.edad >= 60));
// Devuelve: [ [ {nombre: "Ricardo", edad: 63} ],
//             [ {nombre: "Paco", edad: 55}, {nombre: "Enrique", edad: 32}, {nombre: "Adrián", edad: 34} ]
//           ]



function groupByOrdenSuperior(array, f) {
    let resultado = {};
}



function whereOrdenSuperior(array, modelo) {
    let resultado = array.filter(n => n[`${Object.keys(modelo)}`] === modelo[`${Object.keys(modelo)}`]);
    console.log(resultado);
    return resultado;
}

let r1 = whereOrdenSuperior(personas, { edad: 55 });   // Devuelve [ { nombre: 'Paco', edad: 55 } ]
let r2 = whereOrdenSuperior(personas, { nombre: "Adrián" });   // Devuelve [ { nombre: 'Adrián', edad: 34 } ]
let r3 = whereOrdenSuperior(personas, { nombre: "Adrián", edad: 21 }); // Devuelve []


/*EJERCICIO 5*/
function concatenar() {
    let resultado = "";

    if (arguments.length != 0) {
        let separador = arguments[0];

        for (let i = 1; i < arguments.length; i++)
            resultado = resultado + arguments[i] + separador;
    }

    return resultado;
}

//console.log(concatenar()); // Devuelve la cadena vacía
//console.log(concatenar("-")); // Devuelve la cadena vacía
//console.log(concatenar("-","uno")); // Devuelve “uno-”
//console.log(concatenar("-","uno","dos","tres")); // Devuelve “uno-dos-tres-”



/*EJERCICIO 6*/
function mapFilter(array, f) {
    let resultado = [];

    for (let i = 0; i < array.length; i++)
        if (typeof (f(array[i])) != "undefined")
            resultado.push(f(array[i]));

    return resultado;
}

/*console.log(mapFilter(["23", "44", "das", "555", "21"],
    (str) => {
        let num = Number(str);
        if (!isNaN(num)) return num;
    }));*/
// Devuelve: [23, 44, 555, 21]



/*EJERCICIO 7*/
function interpretarColor(str){
    let resultado = {};
    let strAux = str;

    let indRojo = 1;
    let indVerde = 3;
    let indAzul = 5; 
    let rojo = strAux.slice(indRojo, indRojo+2);
    let verde = strAux.slice(indVerde, indVerde+2);
    let azul = strAux.slice(indAzul, indAzul+2);

    resultado.rojo = parseInt(rojo, 16);
    resultado.verde = parseInt(verde, 16);
    resultado.azul = parseInt(azul, 16);

    return resultado;
}

interpretarColor("#201F1E");