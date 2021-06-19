CREATE DATABASE iece_tpr;
USE iece_tpr;

CREATE TABLE proyecto (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(150) NOT NULL,
	descripcion TEXT,
    created_at timestamp NOT NULL DEFAULT current_timestamp
);

CREATE TABLE usuario (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR (255) NOT NULL,
    foto VARCHAR(150),
    proyecto_id INT(11) NOT NULL,
    CONSTRAINT fk_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyecto(id)
);

CREATE TABLE preguntas (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	pregunta VARCHAR(150) NOT NULL,
	descripcion TEXT,
	fechayhora DATETIME NOT NULL DEFAULT current_timestamp,
	status BOOLEAN NOT NULL,
    usuario_id INT(11) NOT NULL, 
	respuesta_id INT(11) NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
ALTER TABLE preguntas MODIFY COLUMN status BOOLEAN NOT NULL DEFAULT 0;

CREATE TABLE respuesta (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	respuesta TEXT,
	fechayhora DATETIME NOT NULL DEFAULT current_timestamp,
	idPreguntaTarea INT(11) NOT NULL,
	usuario_id INT(11) NOT NULL,
    CONSTRAINT fk_respuesta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE tarea (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(150)NOT NULL,
	descripcion TEXT,
	fechayhora DATETIME NOT NULL DEFAULT current_timestamp,
	status BOOLEAN NOT NULL DEFAULT 0,
	idUsuarioSolicitante INT(11) NOT NULL,
	idUsuarioAsignado INT(11) NOT NULL
);

CREATE TABLE reuniones (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fechayhora DATETIME NOT NULL DEFAULT current_timestamp,
	puntosATratar TEXT,
	acuerdos TEXT,
	proximaReunion DATE,
	tareasAsignadas TEXT
);