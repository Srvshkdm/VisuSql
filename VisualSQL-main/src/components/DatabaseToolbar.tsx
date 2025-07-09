
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Database, RotateCcw, Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeToggle } from './ThemeToggle';
import { downloadSQL } from '@/utils/sqlGenerator';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Table {
  id: string;
  name: string;
  columns: any[];
}

interface DatabaseToolbarProps {
  tables: Table[];
  onAddTable: (tableName: string) => void;
  onDeleteTable: (tableId: string) => void;
  sqlCode: string;
}

export const DatabaseToolbar: React.FC<DatabaseToolbarProps> = ({
  tables,
  onAddTable,
  onDeleteTable,
  sqlCode,
}) => {
  const [newTableName, setNewTableName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTable = () => {
    if (newTableName.trim()) {
      onAddTable(newTableName.trim());
      setNewTableName('');
      setIsDialogOpen(false);
    }
  };

  const handleResetSchema = () => {
    if (tables.length === 0) {
      toast.error('No schema to reset!');
      return;
    }
    
    // Delete all tables
    tables.forEach(table => onDeleteTable(table.id));
    toast.success('Schema reset successfully!');
  };

  const handleExportSQL = () => {
    if (!sqlCode) {
      toast.error('No schema to export!');
      return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `database_schema_${timestamp}.sql`;
    downloadSQL(sqlCode, filename);
    toast.success(`Schema exported as ${filename}!`);
  };

  const handleExportJSON = () => {
    if (!sqlCode) {
      toast.error('No schema to export!');
      return;
    }

    const exportData = {
      metadata: {
        exported_at: new Date().toISOString(),
        tables_count: tables.length,
        generator: 'Database Designer Tool'
      },
      tables: tables.map(table => ({
        name: table.name,
        columns: table.columns.map(col => ({
          name: col.name,
          type: col.dataType,
          primary_key: col.isPrimaryKey,
          nullable: col.isNullable,
          unique: col.isUnique,
          default_value: col.defaultValue
        }))
      })),
      sql: sqlCode
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `database_schema_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Complete schema exported as JSON!');
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
      {/* Left Side - Brand and Title */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            VisuSQL
          </h1>
        </Link>
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {tables.length} {tables.length === 1 ? 'table' : 'tables'} • {' '}
          {tables.reduce((acc, table) => acc + table.columns.length, 0)} columns
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-3">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Plus className="h-4 w-4" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Enter table name..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTable()}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTable} disabled={!newTableName.trim()}>
                  Create Table
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportSQL}
          disabled={!sqlCode}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Export SQL
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportJSON}
          disabled={!sqlCode}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export JSON
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetSchema}
          disabled={tables.length === 0}
          className="gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        <ThemeToggle />
      </div>
    </div>
  );
};
