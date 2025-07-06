const reactionRoles = require('../slash-commands/commands/reactionroles');

module.exports = {
  name: 'messageReactionAdd',

  async execute(reaction, user) {
    if (user.bot) return;

    if (reaction.message.id !== reactionRoles.messageId) return;

    const roleId = reactionRoles.roles[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member)
      return;

    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(roleId).catch(console.error);
    }
  }
};
