// BarChart.js
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ width = 500, height = 300 }) => {
    const ref = useRef();

    const [bars, setBars] = useState([]);
    const [label, setLabel] = useState('');
    const [value, setValue] = useState('');

    const handleAddBar = () => {
      if (label && value) {
          setBars([...bars, { label, value: +value }]);
          setLabel('');
          setValue('');
      }
    };

    const handleRemoveBar = (index) => {
        const newBars = [...bars];
        newBars.splice(index, 1);
        setBars(newBars);
    };

    useEffect(() => {

        const svg = d3.select(ref.current)
            .attr("width", width+30)
            .attr("height", height+30);

        // Clear existing SVG content
        svg.selectAll("*").remove();

        const xScale = d3.scaleBand()
            .domain(bars.map(d => d.label))
            .range([30, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bars, d => d.value)])
            .range([height, 30]);

        svg.append("g")
          .attr("transform", `translate(30, 0)`)
          .call(d3.axisLeft(yScale).tickValues(bars.map(d => d.value)).tickSize(0))
          .selectAll(".tick line")
          .attr("stroke", "lightgray")
          .attr("stroke-dasharray", "2,2")
          .attr("x2", width);

        svg.selectAll(".bar")
            .data(bars)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.label))
            .attr("y", height)  // Start at the base for animation
            .attr("width", xScale.bandwidth())
            .attr("height", 0)  // Initial height of 0 for animation
            .attr("fill", "steelblue")
            .transition()  // Start the animation
            .ease(d3.easeElastic)
            .duration(1000)  // Set duration to 1 second (1000 milliseconds)
            .attr("y", d => yScale(d.value))
            .attr("height", d => height - yScale(d.value));

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

    }, [bars, width, height]);

    return (
      <div>
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
              <button onClick={handleAddBar}>Add Bar</button>
          </div>
          <div className="bars-list">
              {bars.map((bar, index) => (
                  <div key={index} className="bar-item">
                      <span>{bar.label}: {bar.value}</span>
                      <button onClick={() => handleRemoveBar(index)}>Remove</button>
                  </div>
              ))}
          </div>
          <svg id="barchart" ref={ref}></svg>
      </div>
  );
}

export default BarChart;
