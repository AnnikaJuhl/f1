const { Client, IntentsBitField } = require('discord.js');

const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('Going for the gap');
});

client.on('messageCreate', (message) => {
    console.log(message.content)
    if (message.content === 'What took you so long?') {
        message.reply('Two words, Max. Las Vegas');
    }

if ("Its lights out" == message.content.replace("’", "")) {
        message.reply('and away we go!') 
        console.log(message.content)
    }
    // it turns out I also had this as a startup/response command (along with the going for the gap
    // thought maybe that's why it wasnt working, wasn't that though!!)

});

client.login(process.env.discord_token);