const User = require("../../modals/User");
const jwt = require("jsonwebtoken");

const config = require("../../config/config");

async function createAccount(req, res, next) {
  try {
    const user = new User(req.body);
    await user.save();
    jwt.sign(
      { id: user.id },
      config.SECRETKEY,
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: err.message });
    next(err);
  }
}

module.exports = createAccount;