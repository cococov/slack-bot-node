export const help = async ({ bot, channel, userId }) => {
  bot.postEphemeral(
    channel,
    userId,
    '\n' +
    '`@buker team #nombre_team --assign #id-mr` para asignar la revisión de un merge request a la persona con menos carga.\n'+
    '`@buker team #nombre_team --status` para ver el estado\n'+
    '`@buker team #nombre_team --create` para crear equipo\n' +
    '`@buker team #nombre_team --remove` para remover equipo\n' +
    '`@buker team #nombre_team --user-add #nombre_user` para crear usuarios a un equipo\n' +
    '`@buker team #nombre_team --user-rm #nombre_user` para remover usuarios a un equipo\n' +
    '`@buker project --list` para listar los proyectos',
  );
};
