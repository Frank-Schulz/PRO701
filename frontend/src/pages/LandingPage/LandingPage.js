import axios from 'axios';
import * as d3 from "d3";
import React, { useEffect, useState } from 'react';
import { Chart } from '../../components/Charts/index';
import Loading from '../../components/Loading';
import './LandingPage.css';

function LandingPage() {
  const [ ancestry, setAncestry ] = useState(null);
  const [ loading, setLoading ] = useState(null);
  const [ treeRoot, SetTreeRoot ] = useState(null);

  //REVIEW: Leave as optional load all?
  const getAncestry = async () => {
    setLoading(true);
    const { data } = await axios.get(`/index`);
    setAncestry(data)
    setLoading(false);
  }

  async function stratifyData() {
    setLoading(true);

    const { data } = await axios.get(`/index/root`);

    var stratify = d3.stratify()
      .parentId((d) => {
        return d.path.substring(0, d.path.lastIndexOf("\\"));
      })
      .id((d) => { return d.path; });

    var root = stratify(data);

    root.sum((d) => {
      return +d.size;
    });

    SetTreeRoot(root);
    setLoading(false);
  }

  useEffect(() => {
    stratifyData();
  }, [])


  return (
    <div className='landing'>
      {loading && <Loading />}

      {!loading && <div>
        {treeRoot && <Chart
          width={1200}
          height={800}
          margin={{
            left: 20,
            top: 20,
            right: 20,
            bottom: 20
          }}
          data={{
            columns: [ [ 0 ] ],
            treeRoot: treeRoot,
            type: 'tree',
          }}
        />}
      </div>}


      {/* <p>{invertCoords(-5, 5)}</p>

      <svg id='petal' width="100" height="100" style={{ overflow: "visible", margin: "5px" }}>
        <path d='M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0'
          fill='none' stroke='#000' strokeWidth="2" transform='translate(50,0)' />
      </svg>
      <svg width="100" height="100" style={{ overflow: "visible", margin: "5px" }}>
        <path d='M-20,0 L-20,40 M20,0 L20,40 M-40,50 C-20,70 20,70 40,50'
          fill='none' stroke='#000' strokeWidth="2" transform='translate(50,0)' />
      </svg> */}

    </div>
  )
}

export default LandingPage
