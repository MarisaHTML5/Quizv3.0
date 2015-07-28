var path = require ('path');

//Postgress DATABASE_URL= postgress://user:passwd@host:port/database
//Sqlite DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]|| null);

var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require ('sequelize');



//Usar BBDD SQlite o postgress

var sequelize = new Sequelize (DB_name, user, pwd,
{
dialect: protocol, 
protocol: protocol,
port: port,
host: host,
storage: storage, //solo sqlite (.env)
omitNull: true //solo postgress
});

//Importar definición de tabla EN LA TRANSPARECENCIA 21 CAMBIA LA NOMENCLATURA??(LA CAMBIO, LA ANTIGUA QUEDA COMENTADA)

/*
var Quiz = sequelize.import (path.join (__dirname, 'quiz'));

exports.Quiz = Quiz; //exporta la definición de la tabla quiz

// crear e inicializar la tabla de preguntas en DB

sequelize.sync().success(function(){   // Este método será el que cree quiz.sqlite de forma automática al hacer npm start
	//success ejecuta el manejador de la tabla una vez creada
	Quiz.count().success(function(count){
		if (count === 0){ //la tabla solo se inicia si está vacía
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			})
			.success (function() {
				console.log ('Base de datos inicializada')
			});
		};
	});
});
*/

var quiz_path = path.join(__dirname, 'quiz'); // parece que lo que añade es una variable más que asigna el path, pero es lo mismo que antes
var Quiz = sequelize.import (quiz_path);

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Exporta tablas

exports.Quiz = Quiz; //exporta la definición de la tabla quiz
exports.Comment = Comment; 

// crear e inicializar la tabla de preguntas en DB

sequelize.sync().then(function(){   // Este método será el que cree quiz.sqlite de forma automática al hacer npm start
	//success ejecuta el manejador de la tabla una vez creada. AQUÍ CAMBIA SUCCESS POR THEN, NO EXPLICA POR QUÉ PERO PARECE SER QUE ES PARA QUE FUNCIONE CON POSTGRESS
	Quiz.count().then(function(count){     //aquí tab cambio success por then
		if (count === 0){ //la tabla solo se inicia si está vacía
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'Humanidades'  //añado tema
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'Humanidades'  //añado tema
			});

			//añado otra pregunta, pero no se ve
			Quiz.create({
				pregunta: 'Capital de Francia',
				respuesta: 'París',
				tema: 'Humanidades'  //añado tema
			})

			.then (function() {
				console.log ('Base de datos inicializada')
			});
		};
	});
});
