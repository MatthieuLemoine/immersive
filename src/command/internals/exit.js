const command = 'exit';
const description = 'Exit cli';
const action = () => process.exit(0);

module.exports = {
  command,
  description,
  action,
};
