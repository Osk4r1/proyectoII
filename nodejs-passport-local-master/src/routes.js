const router = require("express").Router();
const passport = require("passport");
const path = require("path");

const model = require("./models/user");
const publicacion = require("./models/pasantia");

//Ruta a index GET
router.get("/", (req, res, next) => {

  model.find({ tipo: "estudiante" }, (err, estudiantes) => {
    if (err) throw err;
  });  

  model.find({ tipo: "empresa" }, (err, empresas) => {
    if (err) throw err;
    console.log("Numero de empresas:", empresas.length);
    empresa = empresas.length;
  });

  publicacion.find({}, (err, publicaciones) => {
    if (err) throw err;
    console.log("Numero publicaciones: ", publicaciones.length);
    publicaciones = publicaciones.length;
  });

  res.render("./index.ejs");

});

//ruta a login para empresa GET
router.get("/login_empresa", (req, res, next) => {
  /*
  res.sendFile("./autenticacion.html", {
    root: path.join(__dirname, "public")
  });
  */
  res.render("./login_empresa.ejs");
});

//ruta a login para estudiante GET
router.get("/login_estudiante", (req, res, next) => {
  /*
  res.sendFile("./autenticacion.html", {
    root: path.join(__dirname, "public")
  });
  */
  res.render("./login_estudiante.ejs");
});

//ruta a formulario GET
router.get("/formulario", (req, res, next) => {
  res.sendFile("./registro.html", { root: path.join(__dirname, "public") });
});

//ruta a formulario POST
router.post(
  "/formulario",
  passport.authenticate("local-signup", {
    successRedirect: "/formulario",
    failureRedirect: "/",
    failureFlash: true
  })
);

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

//Metoto post que me redirigirá al formulario o me pedira que ingrese nuevamente mis datos
router.post(
  "/signup",

  passport.authenticate("local-signup", {
    failureRedirect: "/",
    passReqToCallback: true,
    failureFlash: true
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

/*
router.get('/profile',isAuthenticated, (req, res, next) => {
  res.sendFile('formulario.html', {root:path.join(__dirname,'public')});
});
*/

//Ruta para el llenar el perfil de estudiante
router.get("/profile", isAuthenticated, (req, res, next) => {
  if (req.user.tipo == "empresa") {
    res.render("formulario_empresa");
  } else {
    res.render("formulario_estudiante");
  }
});

//Ruta para llenar el perfil de empresas
router.get("/profile", isAuthenticated, (req, res, next) => {
  res.render("formulario_empresa");
});

//Ruta para ingreso a pasantias empresa
router.get("/pasantia_empresa", (req, res, next) => {
  res.render("./publicaciones");
});

//Ruta para ingreso a pasantias estudiantes
router.get("/pasantia_estudiante", (req, res, next) => {
  res.redirect("./findPasantia");
});

//Actualizar perfil empresa
router.post("/updateEmp/:id", (req, res, next) => {
  let id = req.params.id;

  var updateUser = {
    nombre: req.body.nombre,
    preferencias: req.body.preferencias,
    estado: true,
    filename: req.file.filename,
    path: '/img/uploads/' + req.file.filename,
    mimetype: req.file.mimetype    
  };

  model.updateOne({ _id: id }, { $set: updateUser }, (err, result) => {
    if (err) throw err;
    console.log("actualizado");

    res.redirect("/findPasantia");
  });
});

//Actualizar perfil estudiante
router.post("/updateEst/:id", (req, res, next) => {
  let id = req.params.id;

  console.log(req.file);

  var updateUser = {
    nombre: req.body.nombre,
    identificacion: req.body.identificacion,
    carrera: req.body.carrera,
    preferencias: req.body.preferencias,
    estado: true,
    filename: req.file.filename,
    path: '/img/uploads/' + req.file.filename,
    mimetype: req.file.mimetype
  };

  model.updateOne({ _id: id }, { $set: updateUser }, (err, result) => {
    if (err) throw err;
    console.log("actualizado");

    res.redirect("/findPasantia");
  });
});

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

//Iniciar sesión y validar perfil empresa
router.post(
  "/signinE",
  passport.authenticate("local-signin", {
    failureRedirect: "/login_empresa"
  }),
  (req, res) => {
    if (req.user.estado === true && req.user.tipo == "empresa") {
      res.redirect("/pasantia_empresa");
    } else if (req.user.estado === false && req.user.tipo === "empresa") {
      res.redirect("/profile_empresa");
    }
  }
  //failureFlash: true
);

//Iniciar sesión y validad perfil estudiante
router.post(
  "/signinA",
  passport.authenticate("local-signin", {
    failureRedirect: "/login_estudiante"
  }),
  (req, res) => {
    if (req.user.estado === true && req.user.tipo == "estudiante") {
      res.redirect("/pasantia_estudiante");
    } else if (req.user.estado === false && req.user.tipo == "estudiante") {
      res.redirect("/profile");
    }
  }
  //failureFlash: true
);

//Mostrar pasantías para estudiante de acuerdo a la carrera
router.get("/pasantiaEst", (req, res, next) => {
  var carrera = req.user.carrera;

  publicacion.find({ carrera: carrera }, (err, pasantias) => {
    if (err) throw err;
    console.log(pasantias);

    res.render("./pasantias_estudiante", { pasantias: pasantias });
  });
});

//Mostrar pasantías a la empresa de acuerdo a su nombre

//Mostrar las pasantías
router.get("/findPasantia", (req, res, next) => {

  var tipo = req.user.tipo;
  console.log('desde rutas: ',tipo);
  var carrera = req.user.carrera;
  var email = req.user.email;

  if (tipo == "empresa") {
    publicacion.find({ empresa: email }, (err, pasantias) => {
      if (err) throw err;
      console.log(pasantias);
      res.render("./pasantias_empresa", { pasantias: pasantias });
    });
  } else {
    publicacion.find({ carrera: carrera }, (err, pasantias) => {
      if (err) throw err;
      console.log(pasantias);
      res.render("./pasantias_estudiante", { pasantias: pasantias });
    });
  }
});

//Guardar una nueva pasantia
router.post("/save", (req, res, next) => {
  var nuevaPasantia = new publicacion();
  nuevaPasantia = req.body;
  nuevaPasantia.empresa = req.user.email;

  console.log(nuevaPasantia);
  publicacion.create(nuevaPasantia, (err, pasantia) => {
    if (err) throw err;
    res.redirect("/findPasantia");
  });
});

//Salir de la aplicación
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
}

module.exports = router;
