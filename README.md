# Documentación del Proyecto de Encuestas

Este proyecto permite a los usuarios crear encuestas personalizadas, administrarlas y compartir un enlace o código para que otras personas puedan responderlas.

## Descripción General

La aplicación está compuesta por un **frontend** y un **backend**. El backend está construido con **NestJS** y sigue una arquitectura modular. El frontend permite tanto a administradores como a usuarios finales interactuar con las encuestas.

## Módulos Principales (Backend)

### 1. Auth Module

* Maneja el inicio de sesión y la autenticación.
* Utiliza JWT para validar las sesiones.
* Roles soportados: Administrador.

### 2. Users Module

* Administra la información del usuario.
* Responsabilidades: creación y gestión de perfiles.

### 3. Surveys Module

* CRUD para encuestas.
* Cada encuesta tiene preguntas personalizables.
* Permite activar o desactivar encuestas.

### 4. Questions Module

* Define la estructura de las preguntas.
* Soporta diferentes tipos:

  * Respuesta abierta.
  * Selección múltiple con única respuesta.

### 5. Public Survey Module

* Permite que cualquier usuario, sin autenticación, acceda a una encuesta pública.
* Acceso mediante **código** o **URL única**.

## Flujo de Usuario

### Administrador

1. Inicia sesión.
2. Crea una encuesta.
3. Añade preguntas a la encuesta.
4. Activa y comparte el enlace o código de la encuesta.

### Usuario Final (Encuestado)

1. Ingresa a la landing page.
2. Introduce el código de la encuesta pública.
3. Responde las preguntas.
4. Envía las respuestas.

## Página Landing

La página principal incluye:

* Botón para ingresar al **Dashboard** si se tiene una cuenta.
* Campo para escribir el **código** de una encuesta pública.
* Botón para ingresar a la encuesta correspondiente.

## Enlaces

* Dashboard (privado): `/dashboard`
* Encuesta pública (acceso por código): `/surveys/:surveyCode`

## Ejemplo de Uso

Un administrador crea una encuesta llamada "Satisfacción del servicio" y se le otorga un código como `12345`.

El administrador comparte `12345` con los usuarios.

Los usuarios ingresan a la landing page, insertan el código y acceden a la encuesta.

## Estado del Proyecto

Actualmente, las funciones principales están implementadas. Pueden añadirse mejoras como:

* Reportes gráficos.
* Tipos adicionales de pregunta.

## Configuración de Variables de Entorno

Para ejecutar el proyecto localmente, es necesario configurar las variables de entorno.

### Frontend
1. Copiar el archivo `.env.example` y renombrarlo a `.env`
2. Establecer el valor de `VITE_API_BASE_URL`


### Backend
1. Copiar el archivo `.env.example` y renombrarlo a `.env`:
2. Completar los valores correspondientes:
3. Si se está usando PostgreSQL localmente, ajustar los parámetros de la base de datos según la instalación local.

