//Modelo de quiz con validación


module.exports = function(sequelize, DataTypes) {
	return sequelize.define ('Quiz', 
	{
		pregunta: { type: DataTypes.STRING, 
			validate: { notEmpty: {msg:"-> Falta pregunta"}}

		},
		respuesta: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta respuesta"}}
		},

		//añado índice temático
		tema: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta tema"}}
		}
	}
	);

	}
