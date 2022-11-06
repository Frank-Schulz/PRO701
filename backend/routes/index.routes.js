var express = require('express');
var router = express.Router();

const {
  getIndex,
  getRoot,
  getChildrenOf,
} = require('../controllers/index.controller');

// GET home page.
router.get('/', getIndex);

// GET root node
router.get('/root', getRoot)

// POST gets the children of the given person
router.post('/children', getChildrenOf)


module.exports = router;
