
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export const RelationshipEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  labelStyle = {},
  data,
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('Deleting edge:', id);
    setEdges((edges) => {
      const newEdges = edges.filter((edge) => edge.id !== id);
      console.log('Edges after deletion:', newEdges);
      return newEdges;
    });
    
    const relationshipInfo = data?.sourceTable && data?.targetTable ? 
      `${data.sourceTable} → ${data.targetTable}` : 
      'relationship';
    toast.success(`${relationshipInfo} removed successfully!`);
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#2563eb',
        }} 
      />
      <EdgeLabelRenderer>
        {/* Relationship Label */}
        {label && (
          <div
            className="absolute pointer-events-none z-40"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 25}px)`,
            }}
          >
            <div 
              className="bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-md border border-blue-200 dark:border-blue-700 shadow-lg"
            >
              {label}
            </div>
          </div>
        )}
        
        {/* Delete Button */}
        <div
          className="absolute z-50"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY + 15}px)`,
            pointerEvents: 'all',
          }}
        >
          <button
            onClick={onEdgeClick}
            className="h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition-all duration-200 hover:scale-110 cursor-pointer"
            title={`Remove ${label || 'relationship'}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
