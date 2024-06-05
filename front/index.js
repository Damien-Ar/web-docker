// Assuming the data is in JSON format and stored in a variable called 'data'

const containerList = document.getElementById('containerList');

function reloadContainers() {
    fetch("/docker/containers")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            data.forEach(container => {
                containerList.innerHTML = ""
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = container.name;
                row.appendChild(nameCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = container.status;
                row.appendChild(statusCell);

                const actionCell = document.createElement('td');
                const actionButton = document.createElement('button')
                if(container.status === "running") {
                    actionButton.textContent = "Stop container"
                    actionButton.classList.add("stop-button")
                    actionButton.addEventListener("click", () => askForKillContainer(container.name))
                }
                else {
                    actionButton.textContent = "Start container"
                    actionButton.classList.add("start-button")
                    actionButton.addEventListener("click", () => askForStartContainer(container.name))
                }
                actionCell.appendChild(actionButton)
                row.appendChild(actionCell);

                containerList.appendChild(row);
            });
        })
}

function getRequestConfig(containerName, method){
  return {
    method: method, 
    body: JSON.stringify({containerName}),
    headers: {
      'Content-Type': 'application/json' // this is the header you asked for
    },
  }
}

function askForKillContainer(containerName){
  fetch(`/docker/containers`, getRequestConfig(containerName, "DELETE"))
    .then(res => {
      console.log(res.status)
      if(res.status == 200) {
        reloadContainers()
      }
      else {
        alert(`Echec de l'arrêt du conteneur ${containerName}`)
      }
    })
    .catch(err => {
      console.error(err)
      alert(`Echec de l'arrêt du conteneur ${containerName}`)
    })
}

function askForStartContainer(containerName){
  fetch(`/docker/containers`, getRequestConfig(containerName, "POST"))
    .then(res => {
      console.log(res.status)
      if(res.status == 200) {
        reloadContainers()
      }
      else {
        alert(`Echec ddu démarage du conteneur ${containerName}`)
      }
    })
    .catch(err => {
      console.error(err)
      alert(`Echec ddu démarage du conteneur ${containerName}`)
    })
}

reloadContainers()    