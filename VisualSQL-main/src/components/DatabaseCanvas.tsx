
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TableNode } from './TableNode';
import { RelationshipEdge } from './RelationshipEdge';
import { toast } from 'sonner';

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

interface DatabaseCanvasProps {
  tables: any[];
  onUpdateTable: (tableId: string, updatedTable: any) => void;
  onDeleteTable: (tableId: string) => void;
}

export const DatabaseCanvas: React.FC<DatabaseCanvasProps> = ({ 
  tables, 
  onUpdateTable, 
  onDeleteTable 
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Update nodes when tables change
  React.useEffect(() => {
    const newNodes = tables.map((table, index) => ({
      id: table.id,
      type: 'table',
      position: { x: 100 + (index % 3) * 450, y: 100 + Math.floor(index / 3) * 400 },
      data: { 
        table,
        onUpdateTable,
        onDeleteTable: (tableId: string) => {
          // Remove all edges connected to this table
          setEdges((eds) => eds.filter((edge) => 
            edge.source !== tableId && edge.target !== tableId
          ));
          onDeleteTable(tableId);
        },
      },
    }));
    setNodes(newNodes);
  }, [tables, setNodes, onUpdateTable, onDeleteTable, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('Creating connection:', params);
      
      // Get source and target tables
      const sourceTable = tables.find(t => t.id === params.source);
      const targetTable = tables.find(t => t.id === params.target);
      
      if (!sourceTable || !targetTable) return;
      
      const relationshipLabel = `${sourceTable.name} → ${targetTable.name}`;

      const newEdge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: 'relationship',
        animated: true,
        style: { 
          stroke: '#2563eb', 
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#2563eb',
        },
        label: relationshipLabel,
        labelStyle: { 
          fill: '#1d4ed8', 
          fontWeight: 600, 
          fontSize: '12px',
          backgroundColor: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb'
        },
        data: {
          sourceTable: sourceTable.name,
          targetTable: targetTable.name,
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      toast.success(`Relationship created: ${relationshipLabel}`);
    },
    [setEdges, tables],
  );

  const onInit = (reactFlowInstance: any) => {
    setReactFlowInstance(reactFlowInstance);
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 transition-colors relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        connectionLineStyle={{
          stroke: '#2563eb',
          strokeWidth: 3,
        }}
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionMode={ConnectionMode.Loose}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1.5} 
          color="#cbd5e1"
          className="dark:opacity-30"
        />
        <Controls 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg [&>button]:bg-white [&>button]:dark:bg-gray-800 [&>button]:border-gray-200 [&>button]:dark:border-gray-700 [&>button]:text-gray-700 [&>button]:dark:text-gray-300"
        />
        <MiniMap 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          nodeColor="#2563eb"
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};
