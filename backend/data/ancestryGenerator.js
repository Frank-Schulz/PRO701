var { faker } = require('@faker-js/faker');
var Person = require('./Person');
var Ancestry = require('./Ancestry');
// var { select } = require('d3');

/**
 * generates a dummy data ancestry dataset containing a specified amount of
 * people (peopleCount). Default 50 people.
 */
function ancestryGenerator(peopleCount = 50) {
  let _ancestry = new Ancestry();
  const initialPerson = new Person();
  initialPerson.DOB = new Date(1850, 1, 1);
  if (initialPerson.age() > 80) {
    futureDate = new Date().setFullYear(initialPerson.DOB.getFullYear() + 70 + Math.floor(Math.random() * 30))
    initialPerson.DOD = new Date(futureDate);
  }
  initialPerson.root = true;
  _ancestry.data.set(initialPerson.id, initialPerson);

  // array containing two functions to make a new relation of the
  // reference person passed to them
  const newRelation = [
    // make a new person and set them as the parent of the reference person
    function (refPerson) {
      const refBirthYear = refPerson.DOB.getFullYear();

      const newParent = new Person();

      // born 20 - 40 years before the reference person (now child of refPerson)
      newParent.DOB = faker.date.birthdate({ min: refBirthYear - 40, max: refBirthYear - 20, mode: 'year' });
      // set relationships
      newParent.children.push(refPerson.id);
      refPerson.parents.push(newParent.id);
      // update refPerson
      _ancestry.data.set(refPerson.id, refPerson);

      return newParent;
    },

    // make a new person and set them as the child of the reference person
    function (refPerson) {
      const refBirthYear = refPerson.DOB.getFullYear();

      let lastName = () => {
        if (Math.floor(Math.random() * 7) > 0) {
          return refPerson.lastName;
        }
        else {
          return undefined;
        }
      }

      const newChild = new Person(lastName = lastName());

      // born 20 - 40 years after the reference person (now parent of refPerson)
      newChild.DOB = faker.date.birthdate({ min: refBirthYear + 20, max: refBirthYear + 40, mode: 'year' });
      // set relationships
      newChild.parents.push(refPerson.id);
      refPerson.children.push(newChild.id);
      // update refPerson
      _ancestry.data.set(refPerson.id, refPerson);

      return newChild;
    }
  ];

  // Controls the creation of a new person in the ancestry dataset.
  // Makes either a parent or child of a reference person.
  const makePerson = () => {
    // 0 = parent of refPerson
    // 1 = child of refPerson
    let relation = Math.floor(Math.random() * newRelation.length);

    const refPerson = _ancestry.getRandomPerson();

    //TODO: set back to        [ relation ]
    let newPerson = newRelation[ 1 ](refPerson);

    // set path
    newPerson.path = refPerson.path + '\\' + newPerson.id;

    // check age, define vital status (set DOD)
    if (newPerson.age() > 80) {
      futureDate = new Date().setFullYear(newPerson.DOB.getFullYear() + 70 + Math.floor(Math.random() * 30))
      newPerson.DOD = new Date(futureDate);
    }

    // add new relation to ancestry
    _ancestry.data.set(newPerson.id, newPerson);
  }

  // create an amount of people in the ancestry dataset as specified by "peopleCount"
  const generateData = () => {
    makePerson();

    // re-call generator if data count hasn't been reached
    if (_ancestry.data.size < peopleCount) {
      generateData();
    }

  }
  console.group(`Generating Ancestry`);
  console.log(`Define ancestry size at /seeder/seed.js`);
  console.time("Data generated");
  console.log(`Generating ${peopleCount} people...`)

  generateData();

  console.timeEnd("Data generated");
  console.groupEnd(`Generating Ancestry`);

  return _ancestry;
}

module.exports = ancestryGenerator;
