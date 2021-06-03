const User = require("../../schema/schemaUser.js");

function signup(req, res) {
  if (!req.body.email || !req.body.password) {
    //The case where the email or the password is not submitted or null
    console.log(req.body);
    res.status(400).json({
      text: "Invalid request",
    });
  } else {
    var user = {
      email: req.body.email,
      password: req.body.password,
    };
    var findUser = new Promise(function (resolve, reject) {
      User.findOne(
        {
          email: user.email,
        },
        function (err, result) {
          if (err) {
            reject(500);
          } else {
            if (result) {
              reject(200);
            } else {
              resolve(true);
            }
          }
        }
      );
    });

    findUser.then(
      function () {
        var _u = new User(user);
        _u.save(function (err, user) {
          if (err) {
            res.status(500).json({
              text: "Internal error",
            });
          } else {
            req.session.token = user.getToken();
            res.redirect("../../ticket/");
          }
        });
      },
      function (error) {
        switch (error) {
          case 500:
            res.status(500).json({
              text: "Internal error",
            });
            break;
          case 200:
            res.status(200).json({
              text: "Email address already exists",
            });
            break;
          default:
            res.status(500).json({
              text: "Internal error",
            });
        }
      }
    );
  }
}

function signupForm(req, res) {
  res.status(200).render("account/signup", { title: "Registration" });
}

function login(req, res) {
  if (!req.body.email || !req.body.password) {
    //The case where the email or the password is not submitted or null
    res.status(400).json({
      text: "Invalid request",
    });
  } else {
    User.findOne(
      {
        email: req.body.email,
      },
      function (err, user) {
        if (err) {
          res.status(500).json({
            text: "Internal Eror",
          });
        } else if (!user) {
          res.status(401).json({
            text: "The user does not exist",
          });
        } else {
          if (user.authenticate(req.body.password)) {
            req.session.token = user.getToken();
            res.redirect("../../ticket/");
          } else {
            res.status(401).json({
              text: "incorrect password",
            });
          }
        }
      }
    );
  }
}

function loginForm(req, res) {
  res.status(200).render("account/login", { title: "Log In" });
}

function signout(req, res) {
  delete req.session.token;
  res.redirect("login");
}

exports.login = login;
exports.loginForm = loginForm;
exports.signup = signup;
exports.signupForm = signupForm;
exports.signout = signout;
