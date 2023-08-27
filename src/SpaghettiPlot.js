import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const simulateTimeSeriesData = () => {
  const numDays = 365;
  const today = new Date();
  const startDate = d3.timeDay.offset(today, -numDays);  // Date 365 days ago
  const randomNormal = d3.randomNormal(0, 1);  // mu=0, sigma=1

  let currentValue = 30;  // Starting value
  const data = d3.timeDay.range(startDate, today).map(date => {
    currentValue += randomNormal();
    return {
      date,
      value: currentValue
    };
  });

  return data;
}

const SpaghettiPlot = ({ width = 500, height = 300 }) => {
  const ref = useRef();

  const [spdata, setSpdata] = useState(simulateTimeSeriesData());

  useEffect(() => {
      const interval = setInterval(() => {
          setSpdata(simulateTimeSeriesData());
      }, 7000);  // Every 7 seconds

      return () => clearInterval(interval);  // Clear the interval when the component is unmounted
  }, []);

  useEffect(() => {

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append("g")
      .attr('class', 'y-axis');

    const xScale = d3.scaleTime()
      .domain(d3.extent(spdata, d => d.date))
      .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(spdata, d => d.value))
      .range([height-margin.top-margin.bottom, 0]);

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

    svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('class', 'data-line');

    svg.append('g')
      .attr('transform', `translate(0,${height-margin.bottom-margin.top})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(20)')
      .style('text-anchor', 'start');

    svg.select('.data-line')
      .datum(spdata)
      .transition()
      .duration(6500)
      .attr('d', line);

    svg.select('.y-axis')
      .transition()
      .duration(2000)
      .call(d3.axisLeft(yScale));

  }, [spdata, width, height]);

  return <svg id="spaghetti" ref={ ref }></svg>;
}

export default SpaghettiPlot;

