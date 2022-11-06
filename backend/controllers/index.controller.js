const asyncHandler = require('express-async-handler');
const People = require('../models/people.model');

//@description      GET all people
//@route            GET /
//access            Public
const getIndex = asyncHandler(async (req, res, next) => {
  People.find({})
    .then((products) => { res.send(products) })
    .catch((error) => { next(error) });
})

//@description      GET root node
//@route            GET /root
//access            Public
const getRoot = asyncHandler(async (req, res, next) => {
  const result = await People.find({ root: true })
    .catch((error) => { next(error) });
  const root = result[ 0 ];

  internalGetChildrenOf(root)
    .then(childArray => {
      const tree = [ root ].concat(childArray);
      res.send(tree);
    })
    .catch((error) => { next(error) });
})

//@description      POST gets the children of the given person
//@route            POST /children
//access            Public
const getChildrenOf = asyncHandler(async (req, res, next) => {
  const person = req.body;

  internalGetChildrenOf(person)
    .then(childArray => {
      res.send(childArray)
    })
    .catch((error) => { next(error) });
})

/**
Retrieves the children of the given person from the database
*/
async function internalGetChildrenOf(person) {
  const { children } = person; // children = array of ids

  const childArray = await People.find({
    id: { $in: children }
  }).lean();

  return childArray;
}


module.exports = {
  getIndex,
  getRoot,
  getChildrenOf,
}
