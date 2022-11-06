import * as d3 from "d3";
import React, { useEffect, useRef } from 'react';

export default function Test1() {
  const petals = useRef();

  const petalPath = 'M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0';

  const colors = { Action: "#ffc8f0", Comedy: "#cbf2bd", Animation: "#afe9ff", Drama: "#ffb09e", Other: "#fff2b4" }

  const movies = [ {
    title: "The Legend of Tarzan", released: '2016 - 06 - 30T12: 00Z', genres: [ "Action", "Adventure" ], rating: 7.6, votes: 541, rated: "PG-13"
  }, {
    title: "Independence Day: Resurgence", released: '2016 - 06 - 23T12: 00Z', genres: [ "Action", "Adventure", "Sci-Fi" ], rating: 5.9, votes: 7058, rated: "PG-13"
  }, {
    title: "Central Intelligence", released: '2016 - 06 - 16T12: 00Z', genres: [ "Comedy", "Crime" ], rating: 7, votes: 4663, rated: "PG-13",
  }, {
    title: "Finding Dory", released: '2016 - 06 - 16T12: 00Z', genres: [ "Animation", "Adventure", "Comedy" ], rating: 8.2, votes: 13158, rated: "PG"
  }, {
    title: "Now You See Me 2", released: '2016 - 06 - 09T12: 00Z', genres: [ "Action", "Comedy", "Thriller" ], rating: 7.3, votes: 2876, rated: "PG-13"
  } ]


  useEffect(() => {
    const svg = d3.select(petals.current);

    svg.selectAll('path').data(movies)
      .attr('fill', (d, i) => colors[ movies[ i ].genres[ 0 ] ])

    return () => {
    }
  })

  return (
    <div id="coloredPetals">
      <svg ref={petals} width='500' height='100' style={{ border: "1px dashed" }}>
        <path d={petalPath} transform='translate(50, 0)' />
        <path d={petalPath} transform='translate(150, 0)' />
        <path d={petalPath} transform='translate(250, 0)' />
        <path d={petalPath} transform='translate(350, 0)' />
        <path d={petalPath} transform='translate(450, 0)' />
      </svg>
    </div>
  )
}
