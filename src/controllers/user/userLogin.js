const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

const User = require("../../modals/User");

async function userLogin(req, res, next) {
  try {
    const { name, password } = req.body;
    let user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    if (user.isBlocked) {
      return res.status(404).json({ errors: [{ msg: "User is blocked" }] });
    }

    const compared = await bcrypt.compare(password, user.password);

    if (!compared) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    jwt.sign(
      { id: user.id },
      config.SECRETKEY,
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error;
        res.json({ token, id: user.id, name });
      }
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
    next(err);
  }
}

module.exports = userLogin;
