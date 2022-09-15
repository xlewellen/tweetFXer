const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const dotenv = require('dotenv')
dotenv.config()

const commands = [
	new SlashCommandBuilder().setName('nofx').setDescription('Adds user to blacklist'),
	new SlashCommandBuilder().setName('fx').setDescription('Removes user from blacklist'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);