import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { StocksAggregates, StocksAggregatesObject } from "@/types";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
const OVERVIEW_HEIGHT = 60;
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
  const brushRef = useRef<SVGGElement>(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

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
  const [xMin, xMax] = d3.extent(allSeries, (d) => new Date(d.t));
  const xScale = useMemo(() => {
    return d3
      .scaleTime()
      .domain(dateRange ?? [xMin!, xMax!])
      .range([0, boundsWidth]);
  }, [dateRange, xMin, xMax, boundsWidth]);
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(Object.keys(stocksAggregates))
    .range(d3.schemeTableau10);
  // Overview chart scale
  const yScaleOverview = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([OVERVIEW_HEIGHT, 0]);
  }, [allSeries, OVERVIEW_HEIGHT]);
  const xScaleOverview: d3.ScaleTime<number, number> = useMemo(() => {
    return d3.scaleTime().domain([xMin!, xMax!]).range([0, boundsWidth]);
  }, [xMin, xMax, boundsWidth]);

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

  useEffect(() => {
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [boundsWidth, 50],
      ]) // small overview height
      .on("end", (event) => {
        if (!event.selection) return;
        const [x0, x1] = event.selection.map(xScaleOverview.invert);
        setDateRange([x0, x1]);
      });

    const svg = d3.select(brushRef.current);
    svg.selectAll("*").remove();
    svg.call(brush);

    // Double-click to reset brush
    svg.on("dblclick", () => {
      svg.call(brush.move, null);
      setDateRange(null);
    });
  }, [xScaleOverview, boundsWidth]);

  // Build the line
  const lineBuilder = (
    series: DataPoint[],
    x: d3.ScaleTime<number, number>,
    y: d3.ScaleLinear<number, number>
  ) =>
    d3
      .line<DataPoint>()
      .x((d) => x(new Date(d.t)))
      .y((d) => y(d.o))(series);

  return (
    <svg width={width} height={height}>
      {/* Legend */}
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top - 20})`}>
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

      {/* Main chart */}
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {Object.entries(stocksAggregates).map(([ticker, series], i) => {
          const linePath = lineBuilder(series as DataPoint[], xScale, yScale);
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

      {/* Overview chart */}
      <g transform={`translate(${MARGIN.left}, ${height - 80})`}>
        {Object.entries(stocksAggregates).map(([ticker, series]) => {
          const linePath = lineBuilder(
            series as DataPoint[],
            xScaleOverview,
            yScaleOverview
          );
          return (
            <path
              key={ticker + "-overview"}
              d={linePath}
              fill="none"
              stroke={colorScale(ticker)}
              strokeWidth={1}
              opacity={0.6}
            />
          );
        })}

        {/* Brush area */}
        <g ref={brushRef} />
      </g>

      {/* Axes */}
      <g
        width={boundsWidth}
        height={boundsHeight}
        ref={axesRef}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      />
    </svg>
  );
};
