const ancestryGenerator = require('./ancestryGenerator');

const getPeopleData = (peopleCount) => {
  const _ancestry = ancestryGenerator(peopleCount);

  let peopleData = [];
  for (const v of _ancestry.data.values()) {
    peopleData.push(v);
  }

  console.log("Saving ancestry...");
  return peopleData;
}

module.exports = getPeopleData;
