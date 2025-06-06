const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Information on all things F1!')
    .addIntegerOption(option =>
      option
        .setName('season')
        .setDescription('What season do you want to learn about?')
        .setAutocomplete(true)
        .setRequired(true)
    ),

  async execute(interaction) {
    const inputYear = interaction.options.getInteger('season');
    await interaction.reply(`${inputYear} was selected`);
  },

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const filePath = path.join(__dirname, '..','data','f1db-seasons.json')

    try {
      const rawData = fs.readFileSync(filePath)
      const seasons = JSON.parse(rawData);

      if (!Array.isArray(seasons)) {
        console.error('Data is not correct')
        return interaction.respond([]);
      }

      const filtered = seasons
        .map(seasons => seasons.year.toString())
        .filter(year => year.startsWith(focusedValue))
        .slice(0, 20)
        .map(year => ({
          name: year,
          value: parseInt(year),
        }));

      await interaction.respond(filtered);
    } catch (error) {
      console.error('Could not be filtered:', error);
      await interaction.respond([]);
    }
  }
};









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