const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const path = require('path');

const { Schema } = mongoose;



const userSchema = new Schema({
  email: String,
  password: String,
  nombre: {type: String, default: ''},
  identificacion: {type: String, default: ''},
  estado: {type: Boolean, default: false},
  carrera: {type: String, default: ''}, 
  preferencias: {type: String, default: ''},
  tipo: {type: String, default: '' },
  filename: {type: String, default: 'perfil.png'},
  path: {type: String, default: '/img/uploads/perfil.png'},
  mimetype: {type: String}
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
