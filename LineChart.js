import React, { useCallback, useState, useMemo } from 'react';
import { scaleTime, extent, scaleLinear, max, line, timeFormat, format } from 'd3';
import { XAxis } from './XAxis';
import { YAxis } from './YAxis';
import { VoronoiOverlay } from './VoronoiOverlay';
import { Tooltip } from './Tooltip';

const xValue = (d) => d.date;
const yValue = (d) => d.deathTotal;

const margin = { top: 50, right: 40, bottom: 80, left: 100 };

const formatDate = timeFormat('%b %d, %y');
const formatComma = format(',');

export const LineChart = ({ data, width, height }) => {
  const [activeRow, setActiveRow] = useState();

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const allData = useMemo(
    () =>
      data.reduce(
        (accumulator, countryTimeseries) =>
          accumulator.concat(countryTimeseries),
        []
      ),
    [data]
  );

  const epsilon = 1;

  const xScale = useMemo(
    () => scaleTime().domain(extent(allData, xValue)).range([0, innerWidth]),
    [allData, xValue]
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([epsilon, max(allData, yValue)])
        .range([innerHeight, 0]),
    [epsilon, allData, yValue]
  );

  const lineGenerator = useMemo(
    () =>
      line()
        .x((d) => xScale(xValue(d)))
        .y((d) => yScale(epsilon + yValue(d))),
    [xScale, xValue, yScale, yValue, epsilon]
  );

  const mostRecentDate = xScale.domain()[1];

  const handleVoronoiHover = useCallback((d) => {
    setActiveRow(d)
  }, []);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <XAxis xScale={xScale} innerHeight={innerHeight} />
        <YAxis yScale={yScale} innerWidth={innerWidth} />
        {data.map((countryTimeseries) => {
          return (
            <path
              className="marker-line"
              d={lineGenerator(countryTimeseries)}
            />
          );
        })}

        <text className='title'>
          Global Covid Deaths Over Time by Country
        </text>
        
        
        <text
          className="axis-label"
          transform={`translate(-40,${innerHeight / 2}) rotate(-90)`}
          text-anchor="middle"
        >
          Cumulative Deaths
        </text>
        <text
          className="axis-label"
          text-anchor="middle"
          alignment-baseline="hanging"
          transform={`translate(${innerWidth / 2},${innerHeight + 40})`}
        >
          Time
        </text>
        <VoronoiOverlay
          onHover={handleVoronoiHover}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          allData={allData}
          lineGenerator={lineGenerator}
          margin={margin}
        />
        {activeRow ? (
          <>
          <path
            className="marker-line active"
            d={lineGenerator(
              data.find(
                (countryTimeseries) =>
                  countryTimeseries.countryName === activeRow.countryName
              )
            )}
          />
          <g 
            transform={`translate(${lineGenerator.x()(
              activeRow
              )}, ${lineGenerator.y()(
              activeRow
              )} )`}
            >
          <circle 
            cx={lineGenerator.x()(activeRow)} 
            cy={lineGenerator.y()(activeRow)}
            r={10}
            />
            <Tooltip activeRow={activeRow} formatComma={formatComma} formatDate={formatDate} className='tooltip-stroke'/>
            <Tooltip activeRow={activeRow} formatComma={formatComma} formatDate={formatDate} className='tooltip'/>
            </g>
          </>
        ) : null}
      </g>
    </svg>
  );
};
