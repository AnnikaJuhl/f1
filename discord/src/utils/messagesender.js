const { EmbedBuilder, Client, GatewayIntentBits, ChannelType } = require('discord.js')
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channelId = '1391556374160478298';
    const channel = await client.channels.fetch(channelId);
    if (!channel || channel.type !== ChannelType.GuildText) {
        console.error('Invalid channel');
        return process.exit(1);
    }

    // module.exports = {
    //     name: 'sendReactionRoles',
    //     description: 'Sends message to be reacted to',

    //     async execute(client) {
    //         const channelId = '1391556374160478298'
    //         const channel = await client.channel.fetch(channelId);

    //         if (!channel || channel.type !== ChannelType.GuildText) {
    //             console.error('Invalid channel')
    //             return;
    //         }

    const roleMessage = `**Select the role and automatically receive updates for that specific session.**  
Die-hard fan? Select the :blue_circle: and receive reminders for all sessions.  
You'll automatically be hailed 10 minutes before a session starts!

:checkered_flag: – Races  
:traffic_light: – Sprints  
:vertical_traffic_light: – Qualification  
:race_car: – Practice  
:blue_circle: – Reminders for all`;

    const sentMessage = await channel.send({ content: roleMessage });

    const emojis = ['🏁', '🚦', '🚥', '🏎️', '🔵'];
    for (const emoji of emojis) {
        await sentMessage.react(emoji);
    }
    console.log('Reaction message sent');
    process.exit();
});
client.login(process.env.TOKEN);
