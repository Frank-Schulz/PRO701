const getPeopleData = require("../data/people.data");
const People = require("../models/people.model");

/**
 * Seeder function for people
*/
const seed = async (state) => {
  console.info("Enable/Disable seeding at:  bin/www - Ln28");
  if (state === `off`) return;
  console.group("Seeding");
  console.info("Seeding person data...");
  console.time("Person data seeded");

  People.deleteMany()
    .then(async () => {
      // save the specified number of people to the database
      await People.insertMany(getPeopleData(10000));
    })
    .then(() => {
      console.timeEnd("Person data seeded");
      console.groupEnd("Seeding");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

};

module.exports = seed;
