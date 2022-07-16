const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (request, response) => JSON.stringify(request.body));

const app = express();

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms :body"));
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const total = persons.length;
  const date = new Date();

  response.send(`<p>Phonebook has info for ${total} people</p><p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const buildError = (error) => {
  return { error };
};

const getPersonByIndex = (index, value) => {
  const person = persons.find(
    (person) => person[index].toLowerCase() === value.toLowerCase()
  );
  return person;
};

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;

  if (!newPerson.name || !newPerson.number) {
    return response
      .status(400)
      .json(buildError("Name and number are required"));
  }

  if (getPersonByIndex("name", newPerson.name)) {
    return response.status(400).json(buildError("name must be unique"));
  }

  if (getPersonByIndex("number", newPerson.number)) {
    return response.status(400).json(buildError("number must be unique"));
  }

  newPerson.id = Math.floor(Math.random() * 1000000);

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
