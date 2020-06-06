const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] }   // save post in the posts object/collection
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;   // pull comment fields from event data

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;   // iterate through the comments array and return the comment with the id from the event data
    });

    comment.status = status;    // assign the status from the event message/data
    comment.content = content;  // for a generic update message, should update all provided fields
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

// the endpoint that will receive events from the event bus
app.post('/events', (req, res) => {
  const { type, data } = req.body;  // pull type and data from event's req.body

  handleEvent(type, data);

  res.send({}); // send an empty object as response
});

app.listen(4002, async () => {
  console.log('Query: Listening on 4002');

  const res = await axios.get('http://localhost:4005/events');
  // with axios the data is available in res.data
  for (let event of res.data) {
    console.log('Processing event: ', event.type);

    handleEvent(event.type, event.data);
  }
});