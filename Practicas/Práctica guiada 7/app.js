"use strict";

// Servicio 1: Devolver todas las entradas contenidas en la lista de tareas:
// Método: GET
// URL: /tasks
// Parámetros de entrada: Ninguno
// Códigos de respuesta: 200 (OK)
// Tipo de resultado: JSON
// Resultado: Array con las tareas de la lista. Cada tarea es un objeto con dos atributos: id y text.

// Servicio 2: Añadir una nueva entrada a la lista de tareas.
// Método: POST
// URL: /tasks
// Parámetros de entrada: Un objeto JSON con un único atributo (text), que contendrá el texto de la tarea a insertar.
// Códigos de respuesta: 200 (OK)
// Tipo de resultado: JSON
// Resultado: Objeto tarea insertado, con dos atributos: id y text. El identificador de la tarea será generado automáticamente por el servidor. El texto será el mismo que el especificado en el parámetro de entrada.

// Servicio 3: Eliminar una entrada a la lista de tareas.
// Método: DELETE
// URL paramétrica: /tasks/:id
// Parámetros de entrada: El parámetro :id de la URL paramétrica contiene el identificador de la tarea a eliminar.
// Códigos de respuesta: 200 (OK) si el :id indicado es un número, 404 (Not found) si no existe el elemento, o 400 (Bad request) si el :id indicado no es un número.
// Tipos de resultado: JSON
// Resultado: Un objeto vacío {}.
