import Table from 'cli-table3';
import chalk from 'chalk';

export class TableFormatter {
  static createTable(headers: string[], rows: string[][]): string {
    const table = new Table({
      head: headers.map(h => chalk.cyan(h)),
      style: {
        head: [],
        border: ['grey']
      }
    });

    rows.forEach(row => table.push(row));
    return table.toString();
  }

  static createKeyValueTable(data: Record<string, string>): string {
    const table = new Table({
      style: {
        head: [],
        border: ['grey']
      }
    });

    Object.entries(data).forEach(([key, value]) => {
      table.push([chalk.cyan(key), value]);
    });

    return table.toString();
  }
}
