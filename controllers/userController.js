const Users = require("../models/userScheama");
const bcrypt = require("bcrypt");

const encryptPwd = async (password, saltRounds) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err; // Re-throw the error for proper handling
  }
};

const userExists = async (username) => {
  try {
    return await Users.findOne({ username });
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

const checkPwd = async (hashPwd, password) => {
  return await bcrypt.compare(password, hashPwd);
};

exports.getUsers = async (req, res) => {
  try {
    const posts = await Users.find();
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Invalid username or password" });
  const existingUser = await userExists(username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  try {
    const hashedPassword = await encryptPwd(password, 10);
    const user = new Users({ username: username, password: hashedPassword });
    user.save().then((data) => console.log(data));
    req.session.user = user;
    res.status(201).send(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await userExists(username);
  try {
    if (existingUser) {
      if (await checkPwd(existingUser.password, password)) {
        req.session.user = existingUser;
        console.log(existingUser)
        res.status(200).send("logged in successfully");
      } else {
        res.status(400).send("Invalid username or password");
      }
    } else {
      res.status(404).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = (req, res) => {
  const { username, password } = req.body;
  Users.findOneAndUpdate(
    { username: username },
    { $set: { hashpwd: password } },
    (err, user) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(user);
      }
    }
  );
};
