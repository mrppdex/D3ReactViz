import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ForestPlot = ({width=500, height=300}) => {
  const ref = useRef();

  const [data, setData] = useState([]);
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [lci, setLci] = useState('');
  const [uci, setUci] = useState('');

  const [xmin, setXmin] = useState('');
  const [xmax, setXmax] = useState('');
  // const [xrange, setXrange] = useState([]);

  const [gbflag, setGbflag] = useState(true);
  const [logflag, setLogflag] = useState(false);

  const swapGoodBad = () => {
    setGbflag(!gbflag);
  }

/*   const updateXaxis = () => {
    if (xrange[0] && Object.keys(xrange[0]).length > 0) {
        setXrange([{
            xmin: (xmin !== undefined && xmin !== null) ? +xmin : xrange[0].xmin,
            xmax: (xmax !== undefined && xmax !== null) ? +xmax : xrange[0].xmax
        }]);
    }
  }  */

  const swapLogAxis = () => {
    setLogflag(logflag ? !logflag : xmin>0); 
  }


  const handleAddData = () => {
    //console.log('lci='+lci+'; uci='+uci);
    if (label && value && ((lci==="" && uci==="") || (lci && uci && +uci>+lci))) {
      setData([...data, {label, value: +value, lci: +lci, uci: +uci}]);
      setLabel('');
      setValue('');
      setLci('');
      setUci('');
    }
  };

  const handleRemoveData = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  useEffect(() => {

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

      let xmini = d3.min(data, d => d.lci);
      let xmaxi = d3.max(data, d => d.uci);
      
      // Instead of checking xrange here, compute the values directly:
      const updatedXrange = {
          xmin: (xmin !== undefined && xmin !== null) ? +xmin : xmini,
          xmax: (xmax !== undefined && xmax !== null) ? +xmax : xmaxi
      };
      // setXrange([updatedXrange]);
      
      // Use the updatedXrange for further computations
      xmini = Math.min(updatedXrange.xmin, xmini) || updatedXrange.xmin;
      xmaxi = Math.max(updatedXrange.xmax, xmaxi) || updatedXrange.xmax;
      
    setXmin(xmini || xmini===0 ? xmini : d3.min(data, d => d.lci));
    setXmax(xmaxi || xmaxi===0 ? xmaxi : d3.max(data, d => d.uci));

    console.log('xmini='+xmini+'; xmaxi='+xmaxi);

    let xScale;
    if (logflag) {
      xScale = d3.scaleLog()
      .domain([xmini, xmaxi])
      .range([margin.left, width - margin.right]);
    } else {
      xScale = d3.scaleLinear()
      .domain([xmini, xmaxi])
      .range([margin.left, width - margin.right]);
    }


    const yScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([height - margin.bottom, margin.top]);

    
    if (data.length>0 && xScale(Number(logflag))>margin.left) {
      // line at x=0
      svg.append("g")
        .append("line")
        .attr("x1", xScale(Number(logflag)))
        .attr("x2", xScale(Number(logflag)))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom)
        .style("stroke", "lightgray");

      let leftStart;
      let leftEnd;
      let leftMiddle;
      let rightStart;
      let rightEnd;
      let rightMiddle;

      if(logflag) {
        leftStart = xScale(xmini + 0.9*(1-xmini));
        leftEnd   = xScale(xmini + 0.1*xmini);
        const leftGeometricMiddle = Math.sqrt((xmini + 0.9*(1-xmini)) * (xmini + 0.1*xmini));
        leftMiddle = xScale(leftGeometricMiddle);
        
        //rightStart = xScale(0.1*xmaxi);
        rightStart = xScale(Math.pow(xmaxi, 0.10));
        //rightEnd   = xScale(0.9*xmaxi);
        rightEnd = xScale(Math.pow(xmaxi, 0.90))
        const rightGeometricMiddle = Math.sqrt(xmaxi);
        rightMiddle = xScale(rightGeometricMiddle);
      } else {
        leftStart = xScale(0.1*xmini);
        leftEnd   = xScale(0.9*xmini);
        leftMiddle = xScale(0.5*xmini);

        rightStart = xScale(0.1*xmaxi);
        rightEnd   = xScale(0.9*xmaxi);
        rightMiddle = xScale(0.5*xmaxi);
      }

      // Draw the Left Arrow Line
      svg.append("line")
        .attr("x1", leftStart)
        .attr("x2", leftEnd)
        .attr("y1", 10) // 10 units from the top for clarity
        .attr("y2", 10)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // Label the Left Arrow
      svg.append("text")
        .attr("x", leftMiddle)
        .attr("y", 5) // slightly above the line
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .text(gbflag ? "good" : "bad");

      // Draw the Right Arrow Line
      svg.append("line")
        .attr("x1", rightStart)
        .attr("x2", rightEnd)
        .attr("y1", 10)
        .attr("y2", 10)
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      // Label the Right Arrow
      svg.append("text")
        .attr("x", rightMiddle)
        .attr("y", 5)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .text(gbflag ? "bad" : "good");

      // Arrowheads
      svg.append("path")
        .attr("d", "M " + leftEnd + " 10 L " + (leftEnd + 5) + " 5 L " + (leftEnd + 5) + " 15 Z")
        .attr("fill", "black");

      svg.append("path")
        .attr("d", "M " + rightEnd + " 10 L " + (rightEnd - 5) + " 5 L " + (rightEnd - 5) + " 15 Z")
        .attr("fill", "black");

    }
    
    // tick horizontal lines
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickValues(data.map(d => d.label)).tickSize(0))
      .selectAll(".tick line")
      .attr("stroke", "lightgray")
      .attr("stroke-dasharray", "2,2")
      .attr("x2", width-margin.right-margin.left);

    svg.append('g')
      .attr('transform',`translate(0, ${height-margin.bottom})`)
      .call(d3.axisBottom(xScale));
      //.call(d3.axisBottom(xScale).tickFormat(d3.format(".1f")));

    svg.selectAll(".confi")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "confi")
      .attr("y", d => yScale(d.label) + (yScale.bandwidth()-5)/2)
      .attr("x", d => xScale(d.lci))
      .attr("width", d => Math.abs(xScale(d.uci)-xScale(d.lci)))
      .attr("height", 0)  // Initial height of 0 for animation
      .attr("fill", "steelblue")
      .transition()  // Start the animation
      .ease(d3.easeElastic)
      .duration(1000)  // Set duration to 1 second (1000 milliseconds)
      .attr("height", 5);

      svg.selectAll(".valueCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "valueCircle")
      .attr("cy", d => yScale(d.label) + yScale.bandwidth() / 2) // centering the circle in the band
      .attr("cx", d => xScale(d.value))
      .attr("r", 0) // initial radius of 0 for animation
      .attr("fill", "#B47846")
      .transition()
      .ease(d3.easeElastic)
      .duration(1000)
      .attr("r", 7); // final radius of the circle
  
  }, [data, xmin, xmax, gbflag, logflag, width, height])

  return (
    <div>
        <div className="input-container">
          <input
            value={xmin}
            onChange={e => setXmin(e.target.value)}
            placeholder="x-min"
            type="number"
          />
          <input
            value={xmax}
            onChange={e => setXmax(e.target.value)}
            placeholder="x-max"
            type="number"
          />
          { /*<button onClick={updateXaxis}>Update Axis</button>*/ }
          <button onClick={swapLogAxis}>Log {logflag ? "off" : "on"}</button>
          <button onClick={swapGoodBad}>Swap Good/Bad</button>
        </div>
        <div className="input-container">
            <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="Label"
            />
            <input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Value"
                type="number"
            />
            <input
                value={lci}
                onChange={e => setLci(e.target.value)}
                placeholder="LCI"
                type="number"
            />
            <input
                value={uci}
                onChange={e => setUci(e.target.value)}
                placeholder="UCI"
                type="number"
            />
            <button onClick={handleAddData}>Add Data</button>
        </div>
        <div className="data-list">
            {data.map((d, index) => (
                <div key={index} className="data-item">
                    <span>{d.label}: {d.value} ({d.lci}, {d.uci})</span>
                    <button onClick={() => handleRemoveData(index)}>Remove</button>
                </div>
            ))}
        </div>
        <svg id="forest" ref={ref}></svg>
    </div>
);

}

export default ForestPlot;