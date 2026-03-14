const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const configRoutes = require('./routes/configRoutes');
const furnitureRoutes = require('./routes/furnitureRoutes');
const textureRoutes = require('./routes/textureRoutes');
;
const path = require('path');

dotenv.config();



const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/textures', textureRoutes);

app.use('/api', apiRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

module.exports = app;
