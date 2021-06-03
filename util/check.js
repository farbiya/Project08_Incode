const Location = require("../schema/schemaTicket");
const User = require("../schema/schemaUser");
const jwt = require("jsonwebtoken");

checkAdmin = async function (user_id) {
  var isAdmin = false;
  await User.findById(user_id)
    .exec()
    .then((user) => {
      if (user.role === "admin") {
        isAdmin = true;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  return isAdmin;
};

module.exports = { checkAdmin };
