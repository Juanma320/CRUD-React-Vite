const app = require('../backend/src/app.js');

module.exports = (req, res) => {
  return app(req, res);
};