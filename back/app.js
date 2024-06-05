import {Docker} from 'node-docker-api';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Serve static files from the 'assets' folder
app.use(express.static('../front'));
app.use(bodyParser.json());

app.get('/docker/containers', async (req, res) => {
  try {
    console.log("request container list")
    docker.container.list({'all': true})
    .then(containers => Promise.all(containers.map(container => container.status())))
    .then(containersStatus => containersStatus.map(status => {return {name: status.data.Name, status: status.data.State.Status}}))
    .then(data => res.json(data))
    .catch(error => console.log(error));
  } catch (error) {
     res.status(500).send('Error fetching Docker containers');
  }
});

app.post('/docker/containers', async (req, res) => {
  console.log("post " + req.body.containerName)
  console.log(req.body)
  docker.container.get()
  res.send()
});

app.delete('/docker/containers', async (req, res) => {
  console.log("post " + req.body.containerName)
  console.log(req.body)
  res.send()
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
 
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
 
