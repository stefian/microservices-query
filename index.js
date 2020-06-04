const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {

});

// the endpoint that will receive events froom the event bus
app.post('/events', (req, res) => {

});

app.listen(4002, () => {
  console.log('Query: Listening on 4002')
});