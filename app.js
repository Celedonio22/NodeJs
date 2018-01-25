var express = require("express");
var app = express();
var body_parser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");

app.use("/estatico", express.static('public'));

app.use(body_parser.json());

app.use(body_parser.urlencoded({ extended: true }));
app.use(session({
    secret: "34312sddasda2",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "jade");

app.get("/", (req, res) => {
    res.render("index");
    console.log(req.session.user_id);
});
app.get("/signup", (req, res) => {
    User.find(function(err, doc) {
        console.log(doc);
        res.render("register");
    });

});
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/users", (req, res) => {
    var user = new User({
        email: req.body.email,
        pass: req.body.pass,
        pass_confirmation: req.body.pass_confirmation
    });
    console.log(user.pass_confirmation);
    /*user.save(function(err) {
        if (err) {
            console.log(String(err));
        }
        res.send("Guardamos los datos");
    });*/
    user.save().then(function(us) {
        res.send("Guardamos los daatos");
    }, function(err) {
        console.log(String(err));
        res.send("Error no guardamos los datos");
    });

});

app.post("/sessions", (req, res) => {
    /*User.find({},"email pass",function(err,docs){

    })*/
    User.findOne({ email: req.body.email, pass: req.body.pass }, function(err, user) {
        /*console.log(docs);
        res.send("Hola");*/
        req.session.user_id = user._id;
        res.send("Hola");
    });
});
app.use("/app", session_middleware)
app.use("/app", router_app);
app.listen(8080);