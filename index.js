require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

morgan.token("body", (request, response) => JSON.stringify(request.body));

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(morgan(":method :url :status :response-time ms :body"));
app.use(cors());

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
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
  const { name, number } = request.body;

  if (!name || !number) {
    return response
      .status(400)
      .json(buildError("Name and number are required"));
  }

  const person = new Person({ name, number });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
