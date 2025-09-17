import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
// import mainData from "./data.json";
import type { StocksAggregates, StocksAggregatesObject } from "@/types";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type DataPoint = StocksAggregates;
type LineChartProps = {
  width: number;
  height: number;
  stocksAggregates: StocksAggregatesObject;
};

export const LineChart = ({
  width,
  height,
  stocksAggregates,
}: LineChartProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allSeries = Object.values(stocksAggregates).flat();

  console.log("data", stocksAggregates);

  // Y axis
  const [min, max] = d3.extent(allSeries, (d) => d.o);
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [allSeries, height]);

  // X axis
  const [xMin, xMax] = d3.extent(allSeries, (d) => d.t);
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([xMin || 0, xMax || 0])
      .range([0, boundsWidth]);
  }, [allSeries, width]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const lineBuilder = d3
    .line<DataPoint>()
    .x((d) => xScale(d.t))
    .y((d) => yScale(d.o));

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {Object.entries(stocksAggregates).map(([ticker, series], i) => {
          const linePath = lineBuilder(series as DataPoint[]);
          if (!linePath) return null;

          return (
            <path
              key={ticker}
              d={linePath}
              fill="none"
              strokeWidth={2}
              stroke={d3.schemeTableau10[i % 10]} // distinct colors
              opacity={0.9}
            />
          );
        })}
      </g>

      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      />
    </svg>
  );
};
