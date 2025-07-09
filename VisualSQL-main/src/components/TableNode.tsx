
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Key, Database, Link } from 'lucide-react';
import { EditTableDialog } from './EditTableDialog';
import { ConfirmDialog } from './ConfirmDialog';

interface Column {
  id: string;
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string;
}

interface Table {
  id: string;
  name: string;
  columns: Column[];
}

interface TableNodeProps {
  data: {
    table: Table;
    onUpdateTable: (tableId: string, updatedTable: Table) => void;
    onDeleteTable: (tableId: string) => void;
  };
}

export const TableNode = memo(({ data }: TableNodeProps) => {
  const { table, onUpdateTable, onDeleteTable } = data;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeleteTable(table.id);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <div className="min-w-[340px] max-w-[440px] group cursor-move">
        <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-t-lg relative overflow-hidden cursor-move">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 cursor-move">
                <Database className="h-5 w-5" />
                {table.name}
              </CardTitle>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-7 w-7 p-0 hover:bg-blue-400 dark:hover:bg-blue-500 rounded-full cursor-pointer"
                  title="Edit table"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-7 w-7 p-0 hover:bg-red-500 dark:hover:bg-red-600 rounded-full cursor-pointer"
                  title="Delete table"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 relative cursor-move">
            <div className="max-h-80 overflow-y-auto">
              {table.columns.map((column, index) => (
                <div
                  key={column.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors cursor-move ${
                    column.isPrimaryKey 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {column.isPrimaryKey && (
                        <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {column.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs dark:border-gray-600 font-mono">
                        {column.dataType}
                      </Badge>
                      <div className="flex gap-1">
                        {!column.isNullable && (
                          <Badge variant="secondary" className="text-xs dark:bg-gray-700">
                            NOT NULL
                          </Badge>
                        )}
                        {column.isUnique && (
                          <Badge variant="secondary" className="text-xs dark:bg-gray-700">
                            UNIQUE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {column.defaultValue && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <span className="font-medium">Default:</span> 
                      <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                        {column.defaultValue}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* General table connection handles */}
        <Handle
          type="source"
          position={Position.Right}
          className="w-4 h-4 bg-blue-500 border-3 border-white dark:border-gray-800 hover:bg-blue-600 hover:scale-125 transition-all duration-200 shadow-lg"
          title="Drag to create table relationship"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="w-4 h-4 bg-blue-500 border-3 border-white dark:border-gray-800 hover:bg-blue-600 hover:scale-125 transition-all duration-200 shadow-lg"
          title="Drop here to create table relationship"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-4 h-4 bg-blue-500 border-3 border-white dark:border-gray-800 hover:bg-blue-600 hover:scale-125 transition-all duration-200 shadow-lg"
          title="Drag to create table relationship"
        />
        <Handle
          type="target"
          position={Position.Top}
          className="w-4 h-4 bg-blue-500 border-3 border-white dark:border-gray-800 hover:bg-blue-600 hover:scale-125 transition-all duration-200 shadow-lg"
          title="Drop here to create table relationship"
        />

        {/* Connection indicator */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Link className="h-3 w-3" />
            Connect
          </div>
        </div>
      </div>

      <EditTableDialog
        table={table}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={(updatedTable) => {
          onUpdateTable(table.id, updatedTable);
          setIsEditDialogOpen(false);
        }}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Table"
        description={`Are you sure you want to delete the table "${table.name}"? This action cannot be undone and will also remove all relationships connected to this table.`}
      />
    </>
  );
});

TableNode.displayName = 'TableNode';
