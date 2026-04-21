const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let users = [];

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields required' });

  const exists = users.find(u => u.email === email);
  if (exists)
    return res.status(400).json({ success: false, message: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(user);

  res.status(201).json({ success: true, message: 'Registered successfully!' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ success: true, token });
};

exports.getMe = (req, res) => {
  res.json({ success: true, data: req.user });
};