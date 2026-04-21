const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'JWT Auth API running 🔐' });
});

app.use('/api/auth', authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));