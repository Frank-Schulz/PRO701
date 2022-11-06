import axios from 'axios';
import * as d3 from 'd3';

/** Constructs new child node using a parent node and it's intended child */
function newNode(node, childNode) {
  const newNodeObj = {
    children: null,
    data: childNode,
    depth: node.depth + 1,
    height: 0,
    id: childNode.id,
    parent: node,
  }

  const newNode = d3.hierarchy(newNodeObj);
  newNode.depth = node.depth + 1;
  newNode.height = 0;
  newNode.parent = node;
  newNode.children = null;
  newNode._children = null;
  return newNode;
};


/** Returns an array of children of the given person */
async function getChildrenOf(person) {
  //TODO: maybe return null if no children
  if (!person.children) return [];

  const config = {
    method: 'post',
    url: '/index/children',
    headers: {
      'Content-Type': 'application/json'
    },
    data: person
  };

  const { data } = await axios(config);
  return data;
}

/** Updates the nodes passed to it

1. Get the children of the node's hidden children
2. Hide / Unhide the node's children*/
export async function updateNode(update, node) {
  //TODO: Refactor
  // if the child has children that are not currently visible, add children to
  // each of the currently invisible nodes
  if (!node.loaded && !node.children && node._children) {
    let newChildren = [], nodeChildren = [];

    await asyncForEach(node._children, async (_child) => {
      // get children of each hidden child node - array
      const _childsChildren = await getChildrenOf(_child.data.data);

      newChildren = [];
      asyncForEach(_childsChildren, selectedChild => {
        let newChildNode = newNode(_child, selectedChild);
        newChildren.push(newChildNode);
      })

      // if newChildren is empty, set as null
      if (newChildren.length == 0) newChildren = null;

      _child._children = newChildren;
      _child.data.children = newChildren;
      nodeChildren.push(_child);

    });
    // set as null if no children
    node._children = nodeChildren.length == 0 ? null : nodeChildren;
    // set flag to not load these children again
    node.loaded = true;
  }
  // if the node has visible children, make them invisible
  if (node.children) {
    node._children = node.children;
    node.children = null;
  }
  // if the node has invisible children, make them visible
  else {
    node.children = node._children;
    node._children = null;
  }

  // update the view to reflect the new changes
  await update(node);
};

/** Returns an elbow transition path */
export function transitionElbow(d) {
  return 'M' + d.source.y + ',' + d.source.x
    + 'H' + d.source.y
    + 'V' + d.source.x
    + 'H' + d.source.y;
}

/** Returns an elbow path */
export function elbow(d, nodeSize) {
  // start point x1, y1
  const x1 = d.source.y + (nodeSize.width / 2);
  const y1 = d.source.x;
  // endpoint x4, y4
  const x4 = d.target.y - (nodeSize.width / 2);
  const y4 = d.target.x;

  const x2 = x1 + (x4 - x1) / 2;
  const y2 = y1;

  const x3 = x2;
  const y3 = y4;

  return `M${x1},${y1}H${x2}V${y2 + (y3 - y2)}H${x4}`;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[ index ], index, array);
  }
}