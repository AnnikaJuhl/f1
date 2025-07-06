const { Events } = require('discord.js');
const { messageID, roles } = require('../slash-commands/commands/reactionroles/reactionroles');

module.exports = {
    name: Events.MessageReactionRemove,

    async execute(reaction, user) {
        if (user.bot)
            return;

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
        console.log(emoji, messageID, reaction.message.id)
        const roleId = roles[emoji];
        if (!roleId)
            return;
        const guild = reaction.message.guild;
        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member)
            return;

        if (member.roles.cache.has(roleId)) {
            console.log("removing", roleId)
            await member.roles.remove(roleId).catch(console.error);
        }
    },
};