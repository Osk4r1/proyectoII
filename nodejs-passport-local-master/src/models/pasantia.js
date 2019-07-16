const mongoose = require('mongoose');

const { Schema } = mongoose;

const pasantiaSchema = new Schema({
    titulo: {type: String, default: ''},
    descripcion: {type: String, default: ''},
    carrera: {type: String, default : ''},
    tipo: {type: String, default: ''},
    ubicacion: {type: String, default :''},
    horas: {type: String, default: ''},
    empresa: {type: String, default: ''}
});


module.exports = mongoose.model('pasantia', pasantiaSchema);