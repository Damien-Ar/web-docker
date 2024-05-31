import {Docker} from 'node-docker-api';
import express from 'express';

const app = express();
const port = 3000;

// Serve static files from the 'assets' folder
app.use(express.static('assets'));

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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
 
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
 
