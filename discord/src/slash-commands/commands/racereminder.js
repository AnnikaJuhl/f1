const { SlashCommandBuilder, EmbedBuilder } = require ('discord.js')

const footer = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/carfooter.jpeg')
const footers = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/Landscapetrack.jpeg')
const logo = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/f1-abu-dhabi-gp-2017-f1-logo-6614911-removebg-preview.png')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reminders')
    .setDescription('Provides reminders and countdowns for free practices, quali, sprints, and races')
    .addSubcommand(subcommand =>
        subcommand
        .setName('practice')
        .setDescription('')
    )


    .setDescription("You'll receive a reminder 15 minutes before the next race starts!")
    .addSubcommand(command =>
        command
        .setName('countdown')
        .setDescription('Gives a countdown to the start of the next race')
        .addSubcommand(subcommand =>
            subcommand
            .setName('quali-reminder')
            .setDescription('Gives a reminder 15 minutes before qualification starts')
            .addsub
        )
    )
}

function raceRemind() {
    cron.schedule('1* * *', async() => {
        const races = await fetchRaces();
        const now = new Date();

        for(const race of races ) {
            const raceDate = new Date(race.date);
            
            const race =(raceDate - now)/(1000 * 60 * 60 * 24);

            if(race > 0 && race > 1.5) {
                sendRemind(race);
            }
        }
    }, 
    { timezone: 'UTC' });
} 

async function raceRemind(race) {
    const channel = await client.channels.fetch()
}