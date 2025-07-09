
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Database, Code, Download, Trash2, Copy, FileText, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeToggle } from './ThemeToggle';
import { downloadSQL } from '@/utils/sqlGenerator';
import { toast } from 'sonner';

interface Table {
  id: string;
  name: string;
  columns: any[];
}

interface DatabaseSidebarProps {
  tables: Table[];
  onAddTable: (tableName: string) => void;
  onDeleteTable: (tableId: string) => void;
  sqlCode: string;
}

export const DatabaseSidebar: React.FC<DatabaseSidebarProps> = ({
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

  const handleDownloadSQL = () => {
    if (!sqlCode) {
      toast.error('No schema to download!');
      return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `database_schema_${timestamp}.sql`;
    downloadSQL(sqlCode, filename);
    toast.success(`Schema downloaded as ${filename}!`);
  };

  const handleCopySQL = async () => {
    if (!sqlCode) {
      toast.error('No schema to copy!');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(sqlCode);
      toast.success('SQL schema copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy SQL schema');
    }
  };

  const handleDeleteTable = (tableId: string, tableName: string) => {
    onDeleteTable(tableId);
  };

  const handleExportSchema = () => {
    if (!sqlCode) {
      toast.error('No schema to export!');
      return;
    }

    // Create a comprehensive export
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
    <div className="w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-purple-600" />
            Database Designer
          </h2>
          <ThemeToggle />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create, visualize & export database schemas
        </p>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-hidden">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg">
              <Plus className="h-4 w-4" />
              Add New Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tableName">Table Name</Label>
                <Input
                  id="tableName"
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

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium dark:text-white flex items-center justify-between">
              <span>Tables ({tables.length})</span>
              {tables.length > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  {tables.reduce((acc, table) => acc + table.columns.length, 0)} columns
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-48">
              {tables.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No tables created yet
                </div>
              ) : (
                <div className="space-y-1">
                  {tables.map((table) => (
                    <div
                      key={table.id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center justify-between group transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {table.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {table.columns.length} columns • {table.columns.filter(c => c.isPrimaryKey).length} PK
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTable(table.id, table.name)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Separator className="dark:bg-gray-700" />

        <div className="space-y-3 flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Code className="h-4 w-4" />
            Generated SQL Schema
          </h3>
          
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-3 text-xs text-green-400 font-mono flex-1 min-h-0 border dark:border-gray-600">
            <ScrollArea className="h-full">
              <pre className="whitespace-pre-wrap">{sqlCode || '-- No tables created yet\n-- Start by adding your first table!'}</pre>
            </ScrollArea>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySQL}
              disabled={!sqlCode}
              className="gap-1 text-xs"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSQL}
              disabled={!sqlCode}
              className="gap-1 text-xs"
            >
              <FileText className="h-3 w-3" />
              SQL
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSchema}
            disabled={!sqlCode}
            className="w-full gap-2 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700"
          >
            <Save className="h-4 w-4" />
            Export Complete Schema
          </Button>
        </div>
      </div>
    </div>
  );
};
