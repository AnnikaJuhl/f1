const reactionRoles = require('../slash-commands/commands/reactionroles');

if (user.bot)
        return;

      if (reaction.message.id !== reactionRoles.messageID)
        return;

      const roleId = reactionRoles.roles[reaction.emoji.name];
      if (!roleId)
        return;

      const guild = reaction.message.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member)
        return;

      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId).catch(console.error);
      }
    })

}