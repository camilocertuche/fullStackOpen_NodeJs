const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.nbjt0.mongodb.net/phonebook?retryWrites=true&w=majority`;

const newName = process.argv[3];
const newNumber = process.argv[4];

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    if (newName && newNumber) {
      const person = new Person({
        name: newName,
        number: newNumber,
      });
      return person.save().then((result) => {
        console.log(
          `added ${result.name} number ${result.number} to phonebook`
        );
        mongoose.connection.close();
      });
    }

    Person.find({}).then((result) => {
      console.log("phonebook");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });
  })
  .catch((err) => console.log(err));
