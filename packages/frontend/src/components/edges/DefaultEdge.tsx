import { EdgeProps, getStraightPath ,EdgeLabelRenderer ,useReactFlow} from "reactflow";

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath,labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      type='straight'
      d={edgePath}
      markerEnd={markerEnd}
    />
    
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          fontSize: 12,
          pointerEvents: 'all',
        }}
        className="nodrag nopan"
      >
        <button id="edgebutton" className="edgebutton" style={{ display: selected ? "block" : "none" }} onClick={onEdgeClick}>
          ×
        </button>
      </div>
    </EdgeLabelRenderer>
    </>
    
  );
}
