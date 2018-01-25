var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var posibles_valores = ["M", "F"];
//recibe dos parametros la direccion y el nombre de la bd
mongoose.connect("mongodb://localhost/fotos", { useMongoClient: true });

var pass_validation = {
    validator: function(p) {
        return this.pass_confirmation == p;
    },
    message: "las contraseñas no coinciden"
}

//Crea el documento de Schema
var email_match = [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "Coloca un email valido"];
var user_schema = new Schema({
    name: String,
    lastName: String,
    age: { type: Number, min: [18, "La edad no puede ser menor a 18"], max: 100 },
    //email: { type: String, required: true },
    email: { type: String, required: "El correo es obligatorio", match: email_match },
    dateOfBirth: Date,
    pass: {
        type: String,
        minlength: [8, "El password es muy corto"],
        validate: pass_validation
    },
    sex: { type: String, enum: { values: posibles_valores, message: "Opción no valida" } }
});

user_schema.virtual("pass_confirmation").get(function() {
    return this.p_c;
}).set(function(pass) {
    this.p_c = pass;
});

var User = mongoose.model("User", user_schema);
module.exports.User = User;