const { EmbedBuilder } = require('discord.js')

const remind = require('../slash-commands/data/upcoming2025.json')
const { sessionRoles } = require('./reactionroles')

const channelId = '1391556374160478298'

const footer = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/carfooter.jpeg')
const footers = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/Landscapetrack.jpeg')
const logo = ('https://raw.githubusercontent.com/AnnikaJuhl/Pitstop-Assests/refs/heads/main/f1-abu-dhabi-gp-2017-f1-logo-6614911-removebg-preview.png')

module.exports = async function sendReminders(client) {
    const sessionTypes = ['practice', 'qualification', 'sprint', 'race'];

    const now = new Date();

    const fuzzynext = {
        race: ['race'],
        sprint: ['sprint'],
        qualification: ['qualifying', 'sprint shootout', 'shootout', 'sprint qualifying'],
        practice: ['practice 1', 'practice 2', 'practice 3', 'free practice', 'practice']
    };

    for (const sessionName of sessionTypes) {
        const keywords = fuzzynext[sessionName];

        const upcoming = remind
            .filter(event => {
                const name = event.event_name.toLowerCase();
                const eventTime = new Date(event.start_time);

                if (eventTime <= now) return false;
                return keywords.some(keyword => name.includes(keyword));
            })
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

        const next = upcoming[0];
        if (!next) continue;

        const startTime = new Date(next.start_time);
        const reminderDelay = startTime.getTime() - now.getTime() - (10 * 60 * 1000);
        if (reminderDelay <= 0) continue;

        const fullName = next.event_name;
        const [grandPrixPart, sessionPartRaw] = fullName.split(' - ');
        const sessionPart = sessionPartRaw
            ? sessionPartRaw.charAt(0).toUpperCase() + sessionPartRaw?.slice(1).toLowerCase()
            : 'Session';

        const cleanedName = grandPrixPart
            .replace(/^FORMULA 1\s+/i, '')
            .replace(/\b20\d{2}\b/g, '')
            .trim();

        const toTitleCase = str =>
            str
                .toLowerCase()
                .split(' ')
                .map(word => {
                    if (word.length === 0) return '';
                    return word[0].toUpperCase() + word.slice(1);
                })
                .join(' ');

        const grandPrixName = toTitleCase(cleanedName);

        const roleId = sessionRoles[sessionName];
        const channel = client.channels.cache.get(channelId);

        if (!roleId || !channel ) continue;

        setTimeout(async () => {
            try {

                const embed = new EmbedBuilder()
                    .setTitle('Reminder for upcoming session')
                    .setThumbnail(logo)
                    .setDescription(`**Buckle Up!** ${grandPrixName} starts in less than 10 minutes!`)
                    .setColor(0x8b0000)
                    .setFooter({ text: 'Automatic Reminder', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setImage(footers);

                await channel.send({content:`<@&${roleId}>`, embeds: [embed]})
            } catch (err) {
                console.error('Could not send remind')
            }
        }, reminderDelay);
    }
}