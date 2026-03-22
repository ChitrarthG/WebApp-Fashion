const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const environment = process.env.NODE_ENV || 'development';
const specificEnvPath = path.resolve(__dirname, '..', `.env.${environment}`);
const fallbackEnvPath = path.resolve(__dirname, '..', '.env');

const envPath = fs.existsSync(specificEnvPath) ? specificEnvPath : fallbackEnvPath;

dotenv.config({ path: envPath });

module.exports = {
  environment,
  envPath,
};