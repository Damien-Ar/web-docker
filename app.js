import { v2 as compose } from "docker-compose";

compose.upOne("web", { cwd: ".", log: true})
const result = await compose.ps({ cwd: ".", commandOptions: [["--format", "json"]] })
result.data.services.forEach((service) => {
  console.log(service.name, service.command, service.state, service.ports)
  // state is one of the defined states: paused | restarting | removing | running | dead | created | exited
})