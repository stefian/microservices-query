const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {

});

// the endpoint that will receive events from the event bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;  // pull type and data from event's req.body

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] }   // save post in the posts object/collection
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;   // pull comment fields from event data

    const post = posts[postId];
    post.comments.push({ id, content });
  }

  res.send({}); // send an empty object as response
});

app.listen(4002, () => {
  console.log('Query: Listening on 4002')
});