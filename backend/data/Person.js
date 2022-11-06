var { faker } = require('@faker-js/faker');

/**
 * This class is used to create new random fake people which are added to a
 * dummy-data ancestry dataset.
*/
class Person {
  constructor(lastName, DOB) {
    this.id = faker.datatype.uuid();
    this.path = `${this.id}`;
    this.firstName = faker.name.firstName();
    this.lastName = lastName || faker.name.lastName();
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.DOB = new Date(DOB || faker.date.birthdate());
    this.DOD = null;
    this.gender = faker.name.gender();
    this.parents = [];
    this.children = [];
  }

  // age = () => {
  //   if (this.DOD) {
  //     const ageDifMs = this.DOD - new Date(this.DOB).getTime();
  //     const ageDate = new Date(ageDifMs);
  //     return Math.abs(ageDate.getUTCFullYear() - 1970);
  //   }
  //   else {
  //     const ageDifMs = Date.now() - new Date(this.DOB).getTime();
  //     const ageDate = new Date(ageDifMs);
  //     return Math.abs(ageDate.getUTCFullYear() - 1970);

  //   };
  // };

  // return age
  age = () => {
    let ageDifMs;
    if (this.DOD) {
      ageDifMs = this.DOD - new Date(this.DOB).getTime();
    }
    else {
      ageDifMs = Date.now() - new Date(this.DOB).getTime();
    };
    const ageDate = new Date(ageDifMs);
    return ageDate.getUTCFullYear() - 1970;
  };

  // return age, DOB, DOD, vitalStatus
  ageDetails = () => {
    const age = this.age()
    return {
      age: age,
      DOB: this.DOB,
      DOD: this.DOD,
      vitalStatus: this.DOD ? `deceased` : `${age <= 0 ? 'unborn' : 'alive'}`
    }
  }
}

module.exports = Person;
