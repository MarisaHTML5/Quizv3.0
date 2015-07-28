var express = require('express');
var router = express.Router();


var quizController= require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller'); //crear comentarios

var sessionController = require('../controllers/session_controller');  //sesiones

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//GET Preguntas: Esto ya no sirve con DB

/*router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);*/

//GET Autor

//probando solo con routes: NO FUNCIONA
/*router.get('/autor', function(req, res) {
  res.render('author', { title: 'Quiz' });
});*/


//Autoload de comandos con :quizID

router.param('quizId', quizController.load);


// Definición de rutas de sesion
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión


//usando quiz controller

router.get('/autor/author', quizController.author); //lo añado para que cargue la página de autor

router.get('/autor/construccion', quizController.construccion); //lo añado para que cargue la página en construccion

//rutas quizes definición. Fase DB
router.get ('/quizes', quizController.index);
router.get ('/quizes/:quizId(\\d+)', quizController.show);
router.get ('/quizes/:quizId(\\d+)/answer', quizController.answer);
//añadir para creación de preguntas por parte del usuario
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',  quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)',     quizController.destroy); //borrar preg

//Gestión de comentarios: Rutas

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);

module.exports = router;
