var express = require('express');
var request = require('supertest');

describe("app.route", function() {
  it("debe retornar la ruta pasantias y renderizar publicaciones.ejs", function(done) {
    var app = express();

    app
      .route("/pasantias")
      .get(function(req, res) {
        res.send("get");
      })
      .post(function(req, res) {
        res.send("post");
      });

    request(app)
      .post("/pasantias")
      .expect("post", done);
  });

  it("retorna la ruta profile y renderiza /formulario", function(done) {
    var app = express();

    app
      .route("/profile")
      .get(function(req, res) {
        res.send("get");
      })
      .post(function(req, res) {
        res.send("post");
      });

    request(app)
      .post("/profile")
      .expect("post", done);
  });

});
