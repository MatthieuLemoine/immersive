const command = 'get <id>';
const description = 'Get user info';

const action = async ({ args, db, logger }) => {
  const id = args._[0];
  const user = await db.get(id);
  if (!user) {
    logger.warn(`No user found with id ${id}`);
    return;
  }
  logger.table({ name: 'Users', rows: [user] });
};

module.exports = {
  command,
  description,
  action,
};
