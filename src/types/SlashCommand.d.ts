import { Collection, Interaction, SlashCommandBuilder } from 'discord.js'

export interface SlashCommand {
    guilds: Array<string> | false
    data: SlashCommandBuilder
    execute(interaction: Interaction): Promise<void>
}

export type SlashCommandType = Collection<string, SlashCommand>
