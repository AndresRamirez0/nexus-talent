const app = require('./src/app');
const { createUsersTable } = require('./src/models/userModel');
const { createPortfoliosTable, createProjectsTable } = require('./src/models/portfolioModel');
const { createFeedbackTables } = require('./src/models/feedbackModel');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await createUsersTable();
  await createPortfoliosTable();
  await createProjectsTable();
  await createFeedbackTables();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();