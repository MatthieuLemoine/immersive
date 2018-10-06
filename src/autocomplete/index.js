import { getCommands } from '../command';

export default (line) => {
  const completions = Object.keys(getCommands()).sort();
  const hits = completions.filter(c => c.startsWith(line));
  return [hits.length ? hits : completions, line];
};
