
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

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

interface EditTableDialogProps {
  table: Table;
  isOpen: boolean;
  onClose: () => void;
  onSave: (table: Table) => void;
}

const DATA_TYPES = [
  'VARCHAR(255)',
  'INTEGER',
  'BIGINT',
  'DECIMAL(10,2)',
  'BOOLEAN',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'TEXT',
  'CHAR(10)',
];

export const EditTableDialog: React.FC<EditTableDialogProps> = ({
  table,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedTable, setEditedTable] = useState<Table>(table);

  useEffect(() => {
    setEditedTable(table);
  }, [table]);

  const addColumn = () => {
    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: 'new_column',
      dataType: 'VARCHAR(255)',
      isPrimaryKey: false,
      isNullable: true,
      isUnique: false,
      defaultValue: '',
    };
    setEditedTable({
      ...editedTable,
      columns: [...editedTable.columns, newColumn],
    });
  };

  const updateColumn = (columnId: string, updates: Partial<Column>) => {
    setEditedTable({
      ...editedTable,
      columns: editedTable.columns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
    });
  };

  const deleteColumn = (columnId: string) => {
    setEditedTable({
      ...editedTable,
      columns: editedTable.columns.filter((col) => col.id !== columnId),
    });
  };

  const handleSave = () => {
    onSave(editedTable);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Table: {table.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              value={editedTable.name}
              onChange={(e) =>
                setEditedTable({ ...editedTable, name: e.target.value })
              }
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Columns</Label>
              <Button onClick={addColumn} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Column
              </Button>
            </div>

            <div className="space-y-3">
              {editedTable.columns.map((column) => (
                <Card key={column.id} className="p-4">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${column.id}`}>Column Name</Label>
                        <Input
                          id={`name-${column.id}`}
                          value={column.name}
                          onChange={(e) =>
                            updateColumn(column.id, { name: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Data Type</Label>
                        <Select
                          value={column.dataType}
                          onValueChange={(value) =>
                            updateColumn(column.id, { dataType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DATA_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`default-${column.id}`}>Default Value</Label>
                        <Input
                          id={`default-${column.id}`}
                          value={column.defaultValue || ''}
                          onChange={(e) =>
                            updateColumn(column.id, { defaultValue: e.target.value })
                          }
                          placeholder="Optional"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`pk-${column.id}`}
                            checked={column.isPrimaryKey}
                            onCheckedChange={(checked) =>
                              updateColumn(column.id, { isPrimaryKey: !!checked })
                            }
                          />
                          <Label htmlFor={`pk-${column.id}`}>Primary Key</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`nullable-${column.id}`}
                            checked={column.isNullable}
                            onCheckedChange={(checked) =>
                              updateColumn(column.id, { isNullable: !!checked })
                            }
                          />
                          <Label htmlFor={`nullable-${column.id}`}>Nullable</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`unique-${column.id}`}
                            checked={column.isUnique}
                            onCheckedChange={(checked) =>
                              updateColumn(column.id, { isUnique: !!checked })
                            }
                          />
                          <Label htmlFor={`unique-${column.id}`}>Unique</Label>
                        </div>
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteColumn(column.id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
