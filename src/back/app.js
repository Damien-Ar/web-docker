import Docker from 'dockerode';
import express from 'express';
import bodyParser from 'body-parser';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express();
const port = 3000;

// Serve static files from the 'assets' folder
app.use(express.static('front'));
app.use(bodyParser.json());

app.get('/docker/containers', async (req, res) => {
  try {
    console.log("request container list")
    docker.listContainers({all: true}, function(err, containers) {
      if(err){
        res.status(500).send('Error fetching Docker containers')
      }
      res.json(containers.map(container => {
        let name
        if(container.Names.length == 0){
          name = "annonymous"
        }
        else if(container.Names[0].startsWith("/")){
          name = container.Names[0].substring(1)
        }
        else {
          name = container.Names[0]
        }
        return {name: name, status: container.State, data: container}
      }))
    })
  } catch (error) {
     res.status(500).send('Error fetching Docker containers');
  }
});

app.post('/docker/containers', async (req, res) => {
  const container = docker.getContainer(req.body.containerName)
  container.start()
    .then(() => res.send())
    .catch((err) => {
      console.error(err)
      res.status(500).send()
    })
});

app.delete('/docker/containers', async (req, res) => {
  const container = docker.getContainer(req.body.containerName)
  container.stop()
    .then(() => res.send())
    .catch((err) => {
      console.error(err)
      res.status(500).send()
    })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
