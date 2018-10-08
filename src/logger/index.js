/* eslint-disable no-console */
import chalk from 'chalk';
import Table from 'cli-table3';
import { isNil } from 'ramda';

const getLogger = (level, colorizer, logger) => (...[arg, ...args]) => logger(`${colorizer(`[${level}]`)}: ${arg}`, ...args);

const error = getLogger('error', chalk.red, console.error);
const warn = getLogger('warn', chalk.yellow, console.warn);
const info = getLogger('info', chalk.green, console.info);
const debug = getLogger('debug', chalk.blue, console.log);
const { log } = console;

const maxValueSize = 36;

const getTruncatedValue = val => `${val.toString().slice(0, maxValueSize)}${
  val.length > maxValueSize ? '...' : ''
}`;

const generateTable = (name, columns, rows) => {
  const table = new Table();
  table.push(
    [
      {
        colSpan: columns.length || 1,
        content: chalk.green(name),
        hAlign: 'center',
      },
    ],
    columns,
    ...rows.map(row => columns.map(column => getTruncatedValue(row[column]))),
  );
  return table.toString();
};

const table = ({ rows, name }) => {
  const truncateds = [];
  const maxWidth = process.stdout.columns * 1.4;
  if (!rows.length) {
    log(generateTable(name, [], rows));
    return;
  }
  const columns = [
    ...rows.reduce((acc, row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (!isNil(value) && value !== '') {
          acc.add(key);
        }
      });
      return acc;
    }, new Set()),
  ];
  const slicedColumns = columns.reduce((acc, column) => {
    const lastSlice = acc[acc.length - 1];
    const addToSlice = rows.every((row) => {
      if (!lastSlice) {
        return false;
      }
      const val = row[column];
      if (val.length > maxValueSize) {
        truncateds.push({ key: column, value: val });
      }
      const generated = generateTable(name, [...lastSlice, column], rows);
      const maxLength = Math.max(...generated.split('\n').map(_ => _.length));
      if (maxLength > maxWidth) {
        return false;
      }
      return true;
    });
    if (addToSlice) {
      return [...acc.slice(0, acc.length - 1), [...lastSlice, column]];
    }
    return [...acc, [column]];
  }, []);
  slicedColumns.forEach(cols => log(generateTable(name, cols, rows)));
  truncateds.forEach(truncated => log(`${chalk.blue(truncated.key)}: ${truncated.value}`));
  log('');
};

export default {
  error,
  warn,
  info,
  debug,
  log,
  table,
};
