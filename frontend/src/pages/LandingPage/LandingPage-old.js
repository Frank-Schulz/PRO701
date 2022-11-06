import './LandingPage.css';
import React, { useState, useEffect } from 'react'
import * as d3 from "d3";
import axios from 'axios';
import Loading from '../../components/Loading';
import Tree from '../../components/Tree/Tree';


function LandingPage() {
  const [ ancestry, setAncestry ] = useState(null);
  const [ loading, setLoading ] = useState(null);
  const [ treeRoot, SetTreeRoot ] = useState(null);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const getAncestry = async () => {
    setLoading(true);
    const { data } = await axios.get(`/index`);
    setAncestry(data)
    // console.log(data);
    setLoading(null);
  }

  // const invertCoords = (x, y) => {
  //   return `${x *= -1},${y *= -1}`
  // }

  const treeifyData = () => {
    var stratify = d3.stratify()
      .parentId(function (d) {
        // console.log(d.path.substring(0, d.path.lastIndexOf("\\")));
        return d.path.substring(0, d.path.lastIndexOf("\\"));
      })
      .id(function (d) {
        return d.path;
      });

    let data = ancestry;

    const columns = [
      'id',
      'firstName', 'lastName', 'fullName',
      'DOB', 'DOD', 'gender',
      'parents', 'children',
      'path',
      'createdAt', 'updatedAt',
      '__v', '_id',
    ];
    // data.push(columns)
    // console.log(data);

    // var data = d3.csvParse(`path,size
    // root,0
    // root\\child1,10
    // root\\child2,20
    // root\\bird,30
    // `);

    var root = stratify(ancestry);

    root.sum(function (d) {
      return +d.size;
    })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });

    // console.log(root);
    SetTreeRoot(root);
    return root;
  }
  // d3.select();

  useEffect(() => {
    getAncestry()

  }, [])

  return (
    <>
      <h2>LandingPage</h2>
      <button onClick={treeifyData}> get ancestry </button>
      <div>
        {loading && <Loading />}
        {/* {ancestry && ancestry
          .map((person) => (
            <p key={person.id}>{person.fullName}</p>
          ))
        } */}
      </div>
      <>
        {treeRoot && <Tree />}
        {/* <Tree /> */}
      </>


      {/* <p>{invertCoords(-5, 5)}</p>

      <svg id='petal' width="100" height="100" style={{ overflow: "visible", margin: "5px" }}>
        <path d='M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0'
          fill='none' stroke='#000' strokeWidth="2" transform='translate(50,0)' />
      </svg>
      <svg width="100" height="100" style={{ overflow: "visible", margin: "5px" }}>
        <path d='M-20,0 L-20,40 M20,0 L20,40 M-40,50 C-20,70 20,70 40,50'
          fill='none' stroke='#000' strokeWidth="2" transform='translate(50,0)' />
      </svg> */}

    </>
  )
}

export default LandingPage
