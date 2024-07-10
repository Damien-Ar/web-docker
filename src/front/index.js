const containerList = document.getElementById('containerList');

function reloadContainers() {
    fetch("/docker/containers")
        .then(res => res.json())
        .then(data => {
            containerList.innerHTML = ""
            data.forEach(container => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = container.name;
                row.appendChild(nameCell);

                const statusCell = document.createElement('td');
                statusCell.setAttribute("data-container-status", container.name)
                statusCell.textContent = container.status;
                row.appendChild(statusCell);

                const actionCell = document.createElement('td');
                actionCell.setAttribute("data-container-action", container.name)
                row.appendChild(actionCell);

                containerList.appendChild(row);
                updateStatusOfContainer(container.name, container.status)
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

function updateStatusOfContainer(containerName, status) {
  document.querySelector(`[data-container-status='${containerName}']`).innerText = status
  const actionCell = document.querySelector(`[data-container-action='${containerName}']`)
  if(status === "running") {
    const actionButton = document.createElement('button')
    actionButton.textContent = "Stop container"
    actionButton.classList.add("stop-button")
    actionButton.addEventListener("click", () => askForKillContainer(containerName))
    actionCell.appendChild(actionButton)
  }
  else if (status === "exited") {
    const actionButton = document.createElement('button')
    actionButton.textContent = "Start container"
    actionButton.classList.add("start-button")
    actionButton.addEventListener("click", () => askForStartContainer(containerName))
    actionCell.appendChild(actionButton)
  }
  else {
    actionCell.innerHTML = ""
  }
}

function askForKillContainer(containerName){
  fetch(`/docker/containers`, getRequestConfig(containerName, "DELETE"))
    .then(res => {
      if(res.status == 200) {
        updateStatusOfContainer(containerName, "stopping")
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
      if(res.status == 200) {
        updateStatusOfContainer(containerName, "starting")
      }
      else {
        alert(`Echec du démarage du conteneur ${containerName}`)
      }
    })
    .catch(err => {
      console.error(err)
      alert(`Echec du démarage du conteneur ${containerName}`)
    })
}

reloadContainers()   
setInterval(() => {
  reloadContainers()
}, 10000) 