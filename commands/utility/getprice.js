const database = require('../../database.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('getprice')
	.setDescription('En kommando til at tjek prisen på en item')
	.addStringOption(option =>
		option.setName('item')
			.setDescription('Navnet på den item du vil tjek prisen på')
            .setRequired(true)
			.setChoices()
		),
	async execute(interaction) {
		const itemName = interaction.options.getString('item');

		choices = ["sand","redsand","stone","cobblestone","smooth_brick","dirt","grass","charcoal","coal","ironore","goldore","ironingot","goldingot","bone","glowstonedust","glowstone","lapislazuli","quartz","redstone","diamond","obsidian","blazerod","enderpearl","book","sugarcane","leather","oaklog","sprucelog","birchlog","junglelog","slimeball","chest","trappedchest","hopper","white_wool","orange_wool","magenta_wool","light_blue_wool","yellow_wool","lime_wool","pink_wool","gray_wool","light_gray_wool","cyan_wool","purple_wool","blue_wool","brown_wool","green_wool","red_wool","black_wool","white_stained_glass","orange_stained_glass","magenta_stained_glass","light_blue_stained_glass","yellow_stained_glass","lime_stained_glass","pink_stained_glass","gray_stained_glass","light_gray_stained_glass","cyan_stained_glass","purple_stained_glass","blue_stained_glass","brown_stained_glass","green_stained_glass","red_stained_glass","black_stained_glass","cocoa_beans","spruce_sapling","glass","emerald","emerald_block"];

		if(!choices.includes(itemName)) {
			await interaction.reply('**Ugyldig item, vælg en af følgende items:** \n' + choices.join(", "));
			return;
		}
	
        try {
            const itemValue = await database.getItemByName(itemName, true); // Pass true to ignore cache
			await interaction.reply('Værdien af ' + itemName + " er " + itemValue + " EMs.");
          } catch (error) {
            console.error('Error getting item from the database:', error);
            await interaction.reply("Der skete en fejl!");
          }
	},
};