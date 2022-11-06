/**
 * class that can be used to construct a new ancestry.
 * Contains the following methods:

 * getRandomPerson() - returns random person from the ancestry data
 */
class Ancestry {
  constructor() {
    this.data = new Map();
  }

  /**
  * returns a random person from the ancestry dataset to be used as a reference
  * for a new person
  */
  getRandomPerson = () => {
    const index = Math.floor(Math.random() * this.data.size);

    let counter = 0;
    for (let key of this.data.keys()) {
      if (counter++ === index) {
        const refPerson = this.data.get(key);
        if (refPerson.parents.length >= 2 || refPerson.children.length >= 4) {
          return this.getRandomPerson();
        }
        return refPerson;
      }
    }
  }
}

module.exports = Ancestry;
