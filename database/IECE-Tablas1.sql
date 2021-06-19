CREATE DATABASE IECE_DSM;
USE IECE_DSM;

CREATE TABLE distrito (
	idDistrito INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	nombre VARCHAR(150) NOT NULL,
	tipoDto VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	idSectorBase INT NOT NULL,
	idObispo INT NOT NULL,
	idObispoSuplete INT NOT NULL DEFAULT 0,
	idSecretario INT NOT NULL DEFAULT 0,
	idSubSecretario INT NOT NULL DEFAULT 0,
	idTesorero INT NOT NULL DEFAULT 0,
	idSubTesorero INT NOT NULL DEFAULT 0,
	fechaOrganizacion DATE NOT NULL DEFAULT GETDATE(),
	domicilioEspecialCorrespondencia VARCHAR(255) NOT NULL DEFAULT 'Por definir'

);

CREATE TABLE sector (
	idSector INT NOT NULL IDENTITY(1,1) PRIMARY KEY, 
	nombre VARCHAR(150),
	tipoSector VARCHAR(80) NOT NULL DEFAULT 'Por definir',
	idDistrito INT NOT NULL,
	idPastor INT NOT NULL,
	idSecretario INT NOT NULL,
	idTesorero INT NOT NULL,
	socFemenil VARCHAR(180) NOT NULL DEFAULT 'Por definir',
	fechaOrgSocFemenil DATE NOT NULL DEFAULT GETDATE(),
	socVaronil VARCHAR(180) NOT NULL DEFAULT 'Por definir',
	fechaOrgSocVaronil DATE NOT NULL DEFAULT GETDATE(),
	socJuvenil VARCHAR(180) NOT NULL DEFAULT 'Por definir',
	fechaOrgSocJuvenil DATE NOT NULL DEFAULT GETDATE(),
	socInfantil VARCHAR(180) NOT NULL DEFAULT 'Por definir',
	fechaOrgSocInfantil DATE NOT NULL DEFAULT GETDATE(),
	coroOficiaL VARCHAR(180) NOT NULL DEFAULT 'Por definir'
);

CREATE TABLE personalMinisterial (
	idMinistro INT NOT NULL IDENTITY(1,1) PRIMARY KEY, 
	idMiembro INT NOT NULL DEFAULT 0,
	gradoMinisterial VARCHAR(60) DEFAULT 'Por definir',
	fechaOrdenamientoDiacono DATE NOT NULL DEFAULT GETDATE(),
	fechaOrdenamientoAnciano DATE NOT NULL DEFAULT GETDATE(),
	dedicado BIT NOT NULL DEFAULT 1,
	ancianoAuxiliar BIT NOT NULL DEFAULT 0,
	activo BIT NOT NULL DEFAULT 1,
	registroGobernacion VARCHAR(80) NOT NULL DEFAULT 'Por definir',
	jubilado BIT NOT NULL DEFAULT 0,
	noCredencial VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	tipoCredencial VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	tituloCredencial VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	servicioMedico VARCHAR(100) NOT NULL DEFAULT 'Por definir',
	emailIECE VARCHAR(80) NOT NULL DEFAULT 'buzon@iece.mx',
	passwordIECE VARCHAR(100) NOT NULL DEFAULT 'Por definir',
	documentoPersonal TEXT NULL,
);

CREATE TABLE miembros (
	idMiembro INT NOT NULL IDENTITY(1,1) PRIMARY KEY, 
	grupo VARCHAR(2) NOT NULL DEFAULT 'B',
	activo BIT NOT NULL DEFAULT 1,
	enComunion BIT NOT NULL DEFAULT 1,
	vivo BIT NOT NULL DEFAULT 1,
	idSector INT NOT NULL DEFAULT 0,
	categoria VARCHAR(60) NOT NULL DEFAULT 'ADULTO_HOMBRE',
	nombre VARCHAR(60) NOT NULL,
	apellidoPaterno VARCHAR(60) NOT NULL,
	apellidoMaterno VARCHAR(60) NOT NULL,
	fechaNacimiento DATE NOT NULL DEFAULT GETDATE(),
	nombrePadre VARCHAR(160) NOT NULL,
	nombreAbueloPaterno VARCHAR(160) NOT NULL,
	nombreAbuelaPaterna VARCHAR(160) NOT NULL,
	estadoCivil VARCHAR(60) NOT NULL DEFAULT 'CASADO/A',
	fechaBodaCivil DATE NOT NULL DEFAULT GETDATE(),
	numActaBodaCivil VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	libroActaBodaCiv VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	oficialiaBodaCivil VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	registroCivil VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	fechaBodaEclesiastica DATE NOT NULL DEFAULT GETDATE(),
	lugarBodaEclesiastica VARCHAR(180) NOT NULL DEFAULT 'Por definir',
	nombreConyege VARCHAR(160) NOT NULL DEFAULT 'Por definir',
	cantidadHijos INT NOT NULL DEFAULT 0,
	nombreHijos TEXT,
	lugarBautismo VARCHAR(255) NOT NULL DEFAULT 'Por definir',
	fechaBautismo DATE NOT NULL DEFAULT GETDATE(),
	ministroQueBautizo VARCHAR(180) NOT NULL DEFAULT 'Por definir',
	fechaRecibioEspirituSanto DATE NOT NULL DEFAULT GETDATE(),
	cambiosDeDomicilio VARCHAR(255) NOT NULL DEFAULT 'Por definir',
	profesionOficio1 VARCHAR (255) NOT NULL DEFAULT 'Por definir',
	profecionOficio2 VARCHAR(2555) NOT NULL DEFAULT 'Por definir',
	celular VARCHAR(60) NOT NULL DEFAULT 'Por definir',
	emailPersonal VARCHAR(80) NOT NULL DEFAULT 'correo@dominio.com'
);