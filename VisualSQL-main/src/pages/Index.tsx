
import React, { useState } from 'react';
import { DatabaseCanvas } from '@/components/DatabaseCanvas';
import { DatabaseToolbar } from '@/components/DatabaseToolbar';
import { SQLCodePanel } from '@/components/SQLCodePanel';
import { generateSQL } from '@/utils/sqlGenerator';
import { toast } from 'sonner';

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

const Index = () => {
  const [tables, setTables] = useState<Table[]>([]);

  const addTable = (tableName: string) => {
    const newTable: Table = {
      id: `table_${Date.now()}`,
      name: tableName,
      columns: [
        {
          id: `col_${Date.now()}`,
          name: 'id',
          dataType: 'INTEGER',
          isPrimaryKey: true,
          isNullable: false,
          isUnique: true,
          defaultValue: '',
        },
      ],
    };
    setTables([...tables, newTable]);
    toast.success(`Table "${tableName}" created successfully!`);
  };

  const updateTable = (tableId: string, updatedTable: Table) => {
    setTables(tables.map(table => 
      table.id === tableId ? updatedTable : table
    ));
    toast.success(`Table "${updatedTable.name}" updated successfully!`);
  };

  const deleteTable = (tableId: string) => {
    const tableToDelete = tables.find(t => t.id === tableId);
    setTables(tables.filter(table => table.id !== tableId));
    if (tableToDelete) {
      toast.success(`Table "${tableToDelete.name}" deleted successfully!`);
    }
  };

  const sqlCode = generateSQL(tables);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top Toolbar */}
      <DatabaseToolbar
        tables={tables}
        onAddTable={addTable}
        onDeleteTable={deleteTable}
        sqlCode={sqlCode}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1">
          <DatabaseCanvas
            tables={tables}
            onUpdateTable={updateTable}
            onDeleteTable={deleteTable}
          />
        </div>
        
        {/* SQL Code Panel */}
        <SQLCodePanel 
          sqlCode={sqlCode}
          tables={tables}
        />
      </div>
    </div>
  );
};

export default Index;
