const { Events } = require('discord.js');
const { messageID, roles } = require('../slash-commands/commands/reactionroles/reactionroles');

module.exports = {
  name: Events.MessageReactionAdd,

  async execute(reaction, user) {
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Issue fetching reaction', error);
        return;
      }
    }
    if (reaction.message.id !== messageID) 
      return;

    const emoji = reaction.emoji.id
      ? `${reaction.emoji.id}:${reaction.emoji.id}`
      : reaction.emoji.name;
      
    const roleId = roles[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member)
      return;

    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(roleId).catch(console.error);
    }
  },
};
