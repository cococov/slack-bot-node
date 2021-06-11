export const help = async ({ bot, channel, userId }) => {
  bot.postEphemeral(
    channel,
    userId,
    '\n' +
    'team status `@buker team #nombre_team --status` para ver el estado\n'+
    'team create `@buker team #nombre_team --create` para crear equipo\n' +
    'team remove `@buker team #nombre_team --remove` para remover equipo\n' +
    'team user-add `@buker team #nombre_team --user-add #nombre_user` para crear usuarios a un equipo\n' +
    'project list `@buker project --list` para listar los proyectos',
  );
};

export default help;
