require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const botRoutes = require('./src/routes/botRoutes'); 
const app = express();

app.use(bodyParser.json());
const server = app.listen(process.env.PORT || 3978, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );
});
app.use('/', botRoutes);