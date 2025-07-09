
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Code2 } from 'lucide-react';
import { downloadSQL } from '@/utils/sqlGenerator';
import { toast } from 'sonner';

interface Table {
  id: string;
  name: string;
  columns: any[];
}

interface SQLCodePanelProps {
  sqlCode: string;
  tables: Table[];
}

export const SQLCodePanel: React.FC<SQLCodePanelProps> = ({
  sqlCode,
  tables,
}) => {
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

  return (
    <div className="w-96 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-600" />
            Generated SQL
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySQL}
              disabled={!sqlCode}
              className="gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSQL}
              disabled={!sqlCode}
              className="gap-1"
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <Card className="h-full dark:bg-gray-900 dark:border-gray-700">
          <CardContent className="p-0 h-full">
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg mx-4 mb-4 h-full border dark:border-gray-600 overflow-hidden">
              <ScrollArea className="h-full">
                <pre className="p-4 text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {sqlCode || `-- No tables created yet
-- Start by adding your first table!

-- This panel will show:
-- • CREATE TABLE statements
-- • Primary key definitions
-- • Foreign key constraints  
-- • Indexes for optimization

-- Tips:
-- • Connect tables by dragging from table edges
-- • Export as SQL or JSON format`}
                </pre>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
