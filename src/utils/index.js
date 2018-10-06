import { compose, reduce, entries } from 'conductor';

export const mergeExport = mainExport => compose(
  reduce((acc, [key, handler]) => {
    if (acc[key]) {
      throw new Error(`${acc} already has a ${key} property. Please find another name.`);
    }
    acc[key] = handler;
    return acc;
  }, mainExport),
  entries,
);

export const parseCommand = (cmd) => {
  const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, ' ');
  const bregex = /\.*[\][<>]/g;
  const index = extraSpacesStrippedCommand.search(bregex);
  const parsedCommand = {
    cmd:
      index > -1 ? extraSpacesStrippedCommand.slice(0, index).trim() : extraSpacesStrippedCommand,
    demanded: [],
    optional: [],
  };
  const variablePart = index > -1 ? extraSpacesStrippedCommand.slice(index) : '';
  const splitCommand = variablePart.split(/\s+(?![^[]*]|[^<]*>)/);
  splitCommand.forEach((item, i) => {
    let variadic = false;
    const command = item.replace(/\s/g, '');
    if (/\.+[\]>]/.test(command) && i === splitCommand.length - 1) variadic = true;
    if (/^\[/.test(command)) {
      parsedCommand.optional.push({
        cmd: command.replace(bregex, '').split('|'),
        variadic,
      });
    } else {
      parsedCommand.demanded.push({
        cmd: command.replace(bregex, '').split('|'),
        variadic,
      });
    }
  });
  return parsedCommand;
};
