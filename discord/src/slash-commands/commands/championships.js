const { SlashCommandBuilder } = require('discord.js')
const drivers = require('../data/DRIVERc.json');
const constructors = require('../data/CONSTRUCTORc.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('championships')
    .setDescription('Information on championships per year and type!')
        .addStringOption(option =>
          option
            .setName('year')
            .setDescription('Choose a year')
            .setAutocomplete(true)
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('Select championship type')
            .setRequired(true)
            .addChoices(
              { name: 'Driver', value: 'driver' },
              { name: 'Constructor', value: 'constructor' }

            )
        ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const driverYears = drivers.map(d => d.year);
    const constructorYears = constructors.map(c => c.year);
    const allYears = Array.from(new Set([...driverYears, ...constructorYears])).sort();

    const filtered = allYears
      .filter(year => year.toString().startsWith(focusedValue))
      .slice(0, 25)
      .map(year => ({
        name: year.toString(),
        value: year.toString()
      }));

    await interaction.respond(filtered);

  },

  async execute(interaction) {
    const year = parseInt(interaction.options.getString('year'));
    const type = interaction.options.getString('type');
    let result, message;

    if (type === 'driver') {
      result = drivers.find(d => d.year === year);
      message = result?.champion
        ? `**${year}** Driver Champion: **${result.champion} (${result.country})**`
        : result?.note || 'No data found.';

    } else if (type === 'constructor') {
      result = constructors.find(c => c.year === year);
      message = result?.constructor
        ? `**${year}** Constructor Champion: **${result.constructor}**`
        : result?.note || 'No data found.';
    }
    await interaction.reply({ content: message });
  }
};




// .setName('wiki')
//   .setDescription('Information on all things Formula 1!')
//   .addSubcommandGroup(group =>
//     group
//       .setName('session-info')
//       .setDescription('Explore general season data!')
//       .addSubcommand(subcommand =>
//         subcommand
//           .setName('championships')
//           .setDescription('Who won the Drivers and Constructors championship')
//           .addStringOption(option =>
//             option
//             //   .setName('driver-championship') //
//             //   .setDescription('See who won the driver championship')
//             //   .addStringOption(option =>
//             // option
//               .setName('constructors-championship') //f1db-seasons-constructors.json
//               .setDescription('See who won the constuctors championship')
//               .setAutocomplete(true)
//               .setRequired(true)
//               )
//           )
//               .addSubcommand(subcommand =>
//                 subcommand
//                   .setName('driver-standings')
//                   .setDescription('Get driver standings for a given season')
//                   .addIntegerOption(option =>
//                     option
//                       .setName('year')
//                       .setDescription('Choose a season')
//                       .setAutocomplete(true)
//                       .setRequired(true)

//                   )
//               )
//                       .addSubcommand(subcommand =>
//                         subcommand
//                           .setName('race')
//                           .setDescription('Get info on a specific race')
//                           .addIntegerOption(option =>
//                             option
//                               .setName('year')
//                               .setDescription('Choose a season')
//                               .setAutocomplete(true)
//                               .setRequired(true)
//                           )
//                           .addIntegerOption(option =>
//                             option
//                               .setName('race-number')
//                               .setDescription('Choose which race you want to learn about')
//                               .setRequired(true)
//                           )
//                       )
//                   ),

//   async execute(interaction) {
//     const subcommandGroup = interaction.options.getSubcommandGroup(false);
//     const subcommand = interaction.options.getSubcommand();
//     const year = interaction.options.getInteger('year');

//     if (subcommandGroup === 'session-info') {
//       if (subcommand === 'championships') {
//         const entrantsPath = path.join(__dirname, '..', 'data', 'season-entrants.json'); //change to correct championship file name
//         const rawText = fs.readFileSync(entrantsPath, 'utf8');
//         const rawData = JSON.parse(rawText);
//         const filteredEntrants = rawData.filter(e => parseInt(e.year) === year);

//         if (!filteredEntrants.length) return interaction.reply(`No data found for ${year}`)

//         await interaction.reply(`Showing entrants for ${year}`);
//       } else if (subcommand === 'driver-standings') {
//         await interaction.reply(`Showing driver standings for ${year}`);
//       } else if (subcommand === 'race') {
//         const racenumber = interaction.options.getInteger('race-number');
//         await interaction.reply(`Showing race ${racenumber} from season ${year}`);
//       } else {
//         await interaction.reply('Unknown subcommand');
//       }
//     }
//   },

// async autocomplete(interaction) {
//   const focusedValue = interaction.options.getFocused();
//   const filePath = path.join(__dirname, '..', 'data', 'f1db-seasons.json')

//     try {
//       const rawData = fs.readFileSync(filePath)
//       const seasons = JSON.parse(rawData);

//       if (!Array.isArray(seasons)) {
//         console.error('Data is not correct')
//         return interaction.respond([]);
//       }

//       const filtered = seasons
//         .map(season => season.year.toString())
//         .filter(year => year.startsWith(focusedValue))
//         .slice(0, 20)
//         .map(year => ({
//           name: year,
//           value: parseInt(year),
//         }));

//       await interaction.respond(filtered);
//     } catch (error) {
//       console.error('Could not be filtered:', error);
//       await interaction.respond([]);
//     }
//   }
// };




//Code graveyard

// async execute(interaction) {
//   const inputYear = interaction.options.getInteger('season');
//   await interaction.reply(`${inputYear} was selected`);


// const filePath = path.join(__dirname, '..','data', 'f1db-seasons.json');
// console.log('Resolved path:', filePath);
// console.log('File exists:', fs.existsSync(filePath));
// let data;

// try {
//     const rawData = fs.readFileSync(filePath);
//     const seasons = JSON.parse(rawData);
//  } catch (error) {
//   console.error('Error reading JSON file', error);
//   return interaction.reply({ content: 'Failed to load', ephemeral:true })
//this block lowk feels fucked but I don't know why or where
// if (!Array.isArray(seasons)) {
//   console.error('Data not an array', seasons);
//   return interaction.respond([]);
// }

//    const filtered = seasons 
//    .map(season => season.year.toString())
//    .filter(year => year.startsWith(focusedValue))
//    .slice(0,25);

//    const results = filtered.map(year => ({
//     name: year,
//     value: parseInt(year)
//    }));

//     console.log('Responding with:', results);
//     await interaction.respond(results);

//   } catch (error) {
//     console.error('Autocomplete error:', error);
//     await interaction.respond([]);
//     }
//   }
// }
//    const found = data.find(entry => entry.year === inputYear);

//    if (found) {
//     await interaction.reply(`${inputYear} was found!`);
//    } else {
//     await interaction.reply(`{${inputYear} was not found`);
//     }
//   }
// };





//   (dataType === 'races') {
//     const racesDir =path.join(basePath, 'races');
//     const raceFiles = fs.readdirSync(racesDir).filter(file => file.endsWith('.json'));
//     const raceData = raceFiles.raceFiles.map(file => {
//       const fileData = JSON.parse(fs.readFileSync(path.join(racesDir, file), 'utf-8'));
//       return fileData;
//     });

//     await interaction.reply('Races in ${`selectedSeason')
//   }
// }
// .addStringOption(option =>
//   option
//   .setName('type')
//   .setDescription('What about tht season?')
//   .setRequired(true)
//   .addChoices(
//     { name: 'Driver Standings', value:'driver-standings' },
//     { name: 'Entrants', value:'entrants' },
//     { name: 'Races', value:'races' },
//   )
// ),
//not needed yet, will be when I add more options

// async autocomplete(interaction) {
//   const focusedValue = interaction.options.getFocused();
//   const filtered = seasons.filter(year =>
//     year.toString().startsWith(focusedValue)
//     //accidentally called as function rather than string
//   );

//   await interaction.respond(
//     filtered
//       .slice(0, 25) //discord allows max of 25, forgot to limit before
//       .map(num => ({ name: num.toString(), value: num }))
//   );
// },