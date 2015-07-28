var models = require('../models/models.js');

/*// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error)});
};*/

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
//modificación para crear texto a buscar (añadirmos el condicional, en else dejamos la función primitiva)

exports.index = function(req, res) {
  if(req.query.search !== undefined) {
    var search = ('%' + req.query.search + '%').replace(/\s/g, '%');
    models.Quiz.findAll({where: ["lower(pregunta) like ?",search.toLowerCase()], 
      order: 'pregunta ASC'}).then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes, errors: []});
      }
    ).catch(function(error) {next(error)});
  }
  //se supone que a partir de aquí el tipo lo elimina, por qué?? pag 13
  else {
    models.Quiz.findAll().then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: []});
    }
  ).catch(function(error) { next(error)});
  }
};

// GET /quizes/:id (question)
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []}); //modificaciones tema errores
};

//GET/autor/author
exports.author=function(req, res){
    res.render('autor/author', {autoria: 'autor', errors:[]});

};

//GET/construction
exports.construccion=function(req, res){
    res.render('autor/construccion', {contruccion: 'obras'});

};


//GET /QUIZES/ NEW
exports.new = function (req, res){
  var quiz = models.Quiz.build( //crea objeto quizz
    {pregunta: "Pregunta", respuesta:"Respuesta", tema:"Tema"});  //AÑADO TEMA
  res.render('quizes/new', {quiz: quiz, errors:[]});
};

//POST QUIZES/CREATE+validación.  FUNCIONA
exports.create = function (req, res){
  var quiz= models.Quiz.build(req.body.quiz);
  //guarda en DB los campos pregun y reso de quiz
  quiz.validate().then(function(err){
    if (err){
      res.render('quizes/new', {quiz: quiz, errors:err.errors});

    }else{

    quiz.save({fields:["pregunta", "respuesta", "tema"]}).then(function(){   //Añadimos el campo tema
    res.redirect('/quizes')}) //Redirecciona a la lista de preguntas
}
}
);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};


//para la edición de preguntas y su almacenamiento
// PUT /quizes/:id
exports.update = function(req, res) {
  
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema; //para que también edite la lista temática


  req.quiz.validate().then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)}); //antes no estaba y funcionaba pero ahora parece que mejor
};
//DELETE Quizes Id

exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};