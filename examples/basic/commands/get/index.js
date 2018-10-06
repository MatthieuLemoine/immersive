module.exports = {
  command: 'get <id>',
  description: 'Get user info',
  action,
};

async function action({ args, db, logger }) {
  const id = args._[0];
  const user = await db.get(id);
  if (!user) {
    logger.warn(`No user found with id ${id}`);
    return;
  }
  logger.table({ name: 'Users', rows: [user] });
}
