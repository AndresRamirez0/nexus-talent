const app = require('./src/app');
const { createUsersTable } = require('./src/models/userModel');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await createUsersTable();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();