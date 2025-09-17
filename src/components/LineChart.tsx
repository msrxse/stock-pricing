import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
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
      .scaleTime()
      .domain([xMin || new Date(), xMax || new Date()])
      .range([0, boundsWidth]);
  }, [allSeries, width]);
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(Object.keys(stocksAggregates))
    .range(d3.schemeTableau10);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat(d3.timeFormat("%b %d") as any);

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
    .x((d) => xScale(new Date(d.t)))
    .y((d) => yScale(d.o));

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top - 10})`}>
        {Object.keys(stocksAggregates).map((ticker, i) => (
          <g key={ticker} transform={`translate(${i * 100}, 0)`}>
            <rect
              width={12}
              height={12}
              fill={colorScale(ticker)}
              rx={2}
              ry={2}
            />
            <text x={18} y={10} fontSize={12} fill="#333">
              {ticker}
            </text>
          </g>
        ))}
      </g>
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
              stroke={colorScale(ticker)}
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
