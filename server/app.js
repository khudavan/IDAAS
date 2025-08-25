import serverless from 'serverless-http';
import expressApp from './server.js';

// This exports a single handler function that the Lambda service will execute.
exports.handler = serverless(expressApp);