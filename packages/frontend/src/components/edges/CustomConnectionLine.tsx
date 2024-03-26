import React from 'react';
import { getStraightPath, ConnectionLineComponentProps } from 'reactflow';

function CustomConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }: ConnectionLineComponentProps) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle cx={fromX} cy={fromY} fill="black" r={3} stroke="black" strokeWidth={1.5} />
    </g>
  );
}

export default CustomConnectionLine;
