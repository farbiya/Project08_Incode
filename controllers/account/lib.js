const User = require("../../schema/schemaUser.js");
const util = require("../util/check");
const jwt = require("jsonwebtoken");

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

exports.homepage = async (req, res) => {
  Location.find({ isApproved: true })
    .exec()
    .then(async (result) => {
      var isAdmin;
      var user_id = navbarCheck(req.headers.cookie);
      if (user_id !== null) {
        isAdmin = await checkAdmin(user_id);
      }
      res.render("account/index", {
        locations: result,
        user_id: user_id,
        isAdmin: isAdmin,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.login = async (req, res) => {
  var user_id = navbarCheck(req.headers.cookie);
  res.render("account/login", { user_id: user_id });
};

exports.signup = async (req, res) => {
  var user_id = navbarCheck(req.headers.cookie);
  res.render("account/register", { user_id: user_id });
};

exports.userPage = async (req, res) => {
  var user_id = req.params.id;
  var isAdmin;
  var user_id_cookies = navbarCheck(req.headers.cookie);
  if (user_id_cookies !== null) {
    isAdmin = await checkAdmin(user_id);
  }
};

exports.adminPage = async (req, res) => {
  Location.find()
    .exec()
    .then(async (result) => {
      var user_id = navbarCheck(req.headers.cookie);
      var isAdmin;
      if (user_id !== null) {
        isAdmin = await checkAdmin(user_id);
      }

      if (isAdmin) {
        res.render("ticket/adminPage", {
          locations: result,
          user_id: user_id,
          isAdmin: isAdmin,
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.approveTicket = async (req, res) => {
  let doc = await Location.findOneAndUpdate(
    { _id: req.body.id },
    { isApproved: true }
  );
  await doc.save();
  res.send("done");
};

exports.login = login;
exports.loginForm = loginForm;
exports.signup = signup;
exports.signupForm = signupForm;
exports.signout = signout;
exports.adminPage = adminPage;
exports.approveTicket = this.approveTicket;
