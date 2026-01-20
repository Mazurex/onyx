import { Interaction, SlashCommandBuilder } from 'discord.js'

export const command = {
    guilds: ['1234'],
    data: new SlashCommandBuilder().setName('ping'),
    async execute(interaction: Interaction) {},
}
