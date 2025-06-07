const { SlashCommandBuilder, AutocompleteInteraction } = require('discord.js')
const drivers = require('../data/DRIVERc.json');
const constructors = require('../data/CONSTRUCTORc.json');
const { autocomplete } = require('./championships');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('f1-history')
        .setDescription('Learn about past Formula 1 races, tracks, teams, and drivers!')
        .addSubcommandGroup(group =>
            group
                .setName('driver')
                .setDescription('Select the driver you want to learn about!')
                .addSubcommand(sc => sc.setName('info').setDescription('Run down of driver'))
                .addSubcommand(sc => sc.setName('stats').setDescription('Statistics of F1 career'))
                .addSubcommand(sc => sc.setName('seasons').setDescription('How many and which seaons they competed in'))

                )
                .addSubcommandGroup(group =>
                    group
                        .setName('season-data')
                        .setDescription('Provides data for a given season')
                        .addSubcommand(sc => sc.setName('calendar').setDescription('Provides race dates and circuits'))
                        .addSubcommand(sc => sc.setName('standings').setDescription('Final standings'))
                        .addSubcommand(sc => sc.setName('specific-race').setDescription('Information on individual races')) //work on getting pages for this one
                ),
    
        async autocomplete(interaction) {
             const focusedValue = interaction.options.getFocused();
             const  
        }
},