
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

export const generateSQL = (tables: Table[]): string => {
  if (tables.length === 0) return '';

  let sql = '';

  // Create tables
  tables.forEach((table, index) => {
    sql += `CREATE TABLE \`${table.name}\` (\n`;
    
    const columnDefinitions = table.columns.map((column) => {
      let definition = `    \`${column.name}\` ${column.dataType.toUpperCase()}`;
      
      // Add NOT NULL constraint
      if (!column.isNullable) {
        definition += ' NOT NULL';
      }
      
      // Add UNIQUE constraint
      if (column.isUnique && !column.isPrimaryKey) {
        definition += ' UNIQUE';
      }
      
      // Add DEFAULT value
      if (column.defaultValue && column.defaultValue.trim() !== '') {
        const defaultValue = column.defaultValue.trim();
        // Check if it's a string type
        if (column.dataType.toUpperCase().includes('VARCHAR') || 
            column.dataType.toUpperCase().includes('TEXT') || 
            column.dataType.toUpperCase().includes('CHAR')) {
          definition += ` DEFAULT '${defaultValue}'`;
        } else if (column.dataType.toUpperCase().includes('TIMESTAMP') && 
                   defaultValue.toUpperCase() === 'CURRENT_TIMESTAMP') {
          definition += ` DEFAULT CURRENT_TIMESTAMP`;
        } else {
          definition += ` DEFAULT ${defaultValue}`;
        }
      }
      
      // Add AUTO_INCREMENT for integer primary keys
      if (column.isPrimaryKey && 
          (column.dataType.toUpperCase().includes('INT') || 
           column.dataType.toUpperCase().includes('SERIAL'))) {
        definition += ' AUTO_INCREMENT';
      }
      
      return definition;
    });

    sql += columnDefinitions.join(',\n');
    
    // Add PRIMARY KEY constraint
    const primaryKeys = table.columns.filter(col => col.isPrimaryKey);
    if (primaryKeys.length > 0) {
      const pkColumns = primaryKeys.map(col => `\`${col.name}\``).join(', ');
      sql += `,\n    PRIMARY KEY (${pkColumns})`;
    }

    sql += '\n);\n\n';
  });

  return sql.trim();
};

export const downloadSQL = (sqlCode: string, filename: string = 'database_schema.sql') => {
  const blob = new Blob([sqlCode], { type: 'text/sql;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
