var express = require('express'),
      path = require('path'),
        bodyParser  = require('body-parser'),
          cons = require('consolidate'),
            dust = require('dustjs-helpers'),
              //pg = require('pg'),
              app = express();

const pool = require('./lib/db');

// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// Set Dust as a default extension
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middle ware
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  // pg connect
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
        }
        //use the client for executing the query
        client.query('SELECT * FROM recipes', function(err, result) {
          if(err) {
            return console.error('error running query', err);
              }
                res.render('index', {recipes: result.rows})
                  done(err);
                    //console.log(result.rows[0].number);
                    //output: 1
                      }); // client.query
                        }); // pool.connect
                          }); // app.get

app.post('/add', function(req, res){
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
        }
          //use the client for executing the query
          client.query("INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)", 
            [req.body.name, req.body.ingredients, req.body.directions]);
              done();
                res.redirect('/');
                  }); // pool.connect
                    }); // app.post


app.delete('/delete/:id', function(req, res){
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
        }
          //use the client for executing the query
          client.query("DELETE FROM recipes WHERE id = $1", 
            [req.params.id]);
              done();
                res.sendStatus(200);
                  }); // pool.connect
                    }); // app.delete

app.post('/edit', function(req, res){
  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
        }
          //use the client for executing the query
          client.query("UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4", 
            [req.body.name, req.body.ingredients, req.body.directions, req.body.id ]);
              done();
                res.redirect('/');
                  }); // pool.connect
                    }); // app.edit

// Server
app.listen(3000, function(){
  console.log('Server Started on Port 3000');
    });


