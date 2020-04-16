const express = require("express");
const cors = require("cors");
const uuid = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function repositoryExists(req, res, next) {
  const { id } = req.params
  const repoIndex = repositories.findIndex(repo => repo.id === id)
  if (repoIndex >= 0) {
    return next()
  }
  return res.status(400).json()
}

app.use('/repositories/:id', repositoryExists)

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const id = uuid.uuid()
  const newRepo = { id, title, url, techs, likes: 0 }
  repositories.push(newRepo)
  return response.json(newRepo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  const repo = repositories[repoIndex]
  repositories[repoIndex] = { ...repo, title, url, techs }

  return response.json(repositories[repoIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repoIndex = repositories.findIndex(repo => repo.id === id)
  repositories.splice(repoIndex, 1)
  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  let repoIndex = 0
  repositories.forEach((repo, index) => {
    if (repo.id === id) {
      repoIndex = index
    }
  })
  const repo = repositories[repoIndex]
  repositories[repoIndex] = { ...repo, likes: repo.likes + 1 }
  return response.json({ likes: repo.likes + 1 })
});

module.exports = app;
