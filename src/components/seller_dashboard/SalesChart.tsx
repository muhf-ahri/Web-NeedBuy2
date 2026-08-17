import React, { useMemo, useRef, useState, useEffect } from 'react';

import { formatRupiah } from '../../utils/currency';
import type { SalesPoint } from '../../api/dashboard';

interface SalesChartProps {
  points: SalesPoint[];
  granularity: string;
}

function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midX = (p0.x + p1.x) / 2;
    path += ` Q ${midX},${p0.y} ${midX},${(p0.y + p1.y) / 2}`;
    path += ` T ${p1.x},${p1.y}`;
  }
  return path;
}

const SalesChart: React.FC<SalesChartProps> = ({ points, granularity }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = containerRef.current?.offsetWidth ?? 0;
      setIsSmall(w < 480);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const paddingX = isSmall ? 16 : 30;
  const paddingY = isSmall ? 16 : 24;
  const width = 800;
  const height = 260;

  const { revenuePoints, itemsPoints, gridLines } = useMemo(() => {
    if (points.length === 0) {
      return { revenuePoints: [], itemsPoints: [], gridLines: [] };
    }

    const maxR = Math.max(...points.map((p) => p.revenue), 1);
    const maxI = Math.max(...points.map((p) => p.items), 1);

    const x = (i: number) =>
      points.length === 1
        ? width / 2
        : paddingX + (i * (width - paddingX * 2)) / (points.length - 1);
    const yR = (v: number) =>
      height - paddingY - (v / maxR) * (height - paddingY * 2);
    const yI = (v: number) =>
      height - paddingY - (v / maxI) * (height - paddingY * 2);

    const rPts = points.map((p, i) => ({ x: x(i), y: yR(p.revenue) }));
    const iPts = points.map((p, i) => ({ x: x(i), y: yI(p.items) }));

    const gridCount = 4;
    const gridLines = Array.from({ length: gridCount + 1 }).map((_, i) => {
      const v = (maxR / gridCount) * (gridCount - i);
      const yPos = paddingY + (i * (height - paddingY * 2)) / gridCount;
      return { y: yPos, value: v };
    });

    return {
      revenuePoints: rPts,
      itemsPoints: iPts,
      gridLines,
    };
  }, [points, paddingX, paddingY]);

  if (points.length === 0) {
    return (
      <div
        className="
          flex h-48 items-center justify-center rounded-2xl border
          border-dashed border-[#D8DEE9] bg-[#F5F7FB]/50 sm:h-60
        "
      >
        <div className="px-4 text-center">
          <p className="text-[13px] font-semibold text-[#20242D]">
            Belum ada penjualan
          </p>
          <p className="mt-0.5 text-[11px] text-[#737A87]">
            Data grafik akan muncul begitu ada transaksi.
          </p>
        </div>
      </div>
    );
  }

  const revenuePath = smoothPath(revenuePoints);
  const itemsPath = smoothPath(itemsPoints);
  const areaPath =
    revenuePath +
    ` L ${revenuePoints[revenuePoints.length - 1].x},${height - paddingY}` +
    ` L ${revenuePoints[0].x},${height - paddingY} Z`;

  const labelFor = (iso: string) => {
    const date = new Date(iso);
    if (granularity === 'hour')
      return `${String(date.getHours()).padStart(2, '0')}.00`;
    if (granularity === 'month')
      return date.toLocaleDateString('id-ID', { month: 'short' });
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    let closestIdx = 0;
    let closestDist = Infinity;
    revenuePoints.forEach((pt, i) => {
      const d = Math.abs(pt.x - mouseX);
      if (d < closestDist) {
        closestDist = d;
        closestIdx = i;
      }
    });
    setHoverIndex(closestIdx);
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((touch.clientX - rect.left) / rect.width) * width;
    let closestIdx = 0;
    let closestDist = Infinity;
    revenuePoints.forEach((pt, i) => {
      const d = Math.abs(pt.x - mouseX);
      if (d < closestDist) {
        closestDist = d;
        closestIdx = i;
      }
    });
    setHoverIndex(closestIdx);
  };

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const hoveredXY = hoverIndex !== null ? revenuePoints[hoverIndex] : null;

  const maxLabels = isSmall ? 4 : 8;
  const step = Math.max(1, Math.ceil(points.length / maxLabels));
  const xAxisLabels = points
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => i === 0 || i === points.length - 1 || i % step === 0);

  const tooltipLeft = hoveredXY ? (hoveredXY.x / width) * 100 : 0;
  const tooltipClampedLeft = Math.min(Math.max(tooltipLeft, 20), 80);

  return (
    <div ref={containerRef}>
      <div className="relative">
        {hoveredPoint && hoveredXY && (
          <div
            className="
              pointer-events-none absolute z-20 w-max max-w-[200px]
              rounded-xl border border-white/80 bg-[#20242D]/95 px-3 py-2
              text-white shadow-[0_8px_24px_rgba(32,36,45,0.25)]
              backdrop-blur-sm
            "
            style={{
              left: `${tooltipClampedLeft}%`,
              top: `${Math.max((hoveredXY.y / height) * 100 - 4, 8)}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="text-[9px] text-white/60 sm:text-[10px]">
              {labelFor(hoveredPoint.bucket)}
            </p>
            <p className="mt-0.5 text-[11px] font-bold tabular-nums sm:text-[12px]">
              {formatRupiah(hoveredPoint.revenue)}
            </p>
            <p className="text-[9px] text-[#FFD500] sm:text-[10px]">
              {hoveredPoint.items} barang terjual
            </p>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-48 w-full cursor-crosshair sm:h-56 md:h-60"
          preserveAspectRatio="none"
          role="img"
          aria-label="Grafik penjualan"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={() => setHoverIndex(null)}
          onTouchEnd={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#538CDB" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#538CDB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={paddingX}
                y1={g.y}
                x2={width - paddingX}
                y2={g.y}
                stroke="#E8ECF4"
                strokeWidth={1}
                strokeDasharray={i === gridLines.length - 1 ? '0' : '4 4'}
              />
              {!isSmall && (
                <text
                  x={paddingX - 6}
                  y={g.y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#A2A8B3"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {g.value >= 1000000
                    ? `${(g.value / 1000000).toFixed(1)}jt`
                    : g.value >= 1000
                      ? `${(g.value / 1000).toFixed(0)}k`
                      : g.value.toFixed(0)}
                </text>
              )}
            </g>
          ))}

          <path d={areaPath} fill="url(#revenue-gradient)" />

          <path
            d={revenuePath}
            fill="none"
            stroke="#538CDB"
            strokeWidth={2.5}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={itemsPath}
            fill="none"
            stroke="#FFD500"
            strokeWidth={2}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {revenuePoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? 5 : 3}
              fill="white"
              stroke="#538CDB"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              style={{ transition: 'r 0.15s ease' }}
            />
          ))}

          {hoveredXY && (
            <line
              x1={hoveredXY.x}
              y1={paddingY}
              x2={hoveredXY.x}
              y2={height - paddingY}
              stroke="#538CDB"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.5}
            />
          )}
        </svg>

        <div
          className={`
            mt-2 flex justify-between text-[9px] text-[#A2A8B3] sm:text-[10px]
          `}
          style={{ paddingLeft: paddingX, paddingRight: paddingX }}
        >
          {xAxisLabels.map(({ p, i }) => (
            <span
              key={i}
              className={hoverIndex === i ? 'font-bold text-[#538CDB]' : ''}
            >
              {labelFor(p.bucket)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#F5F7FB] pt-3">
        <span className="flex items-center gap-2 text-[10px] font-medium text-[#737A87] sm:text-[11px]">
          <span className="h-0.5 w-5 rounded-full bg-[#538CDB]" />
          Pemasukan (Rp)
        </span>
        <span className="flex items-center gap-2 text-[10px] font-medium text-[#737A87] sm:text-[11px]">
          <span
            className="
              h-0.5 w-5 rounded-full border-t border-dashed border-[#FFD500]
            "
          />
          Barang terjual
        </span>
      </div>
    </div>
  );
};

export default SalesChart;