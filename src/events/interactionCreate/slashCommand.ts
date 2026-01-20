import { Interaction, MessageFlags } from 'discord.js'
import { slash_commands } from '../../index'
import { logger } from '../../utils/logger'

export const event = {
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return
        if (!slash_commands) return

        const command = slash_commands.get(interaction.commandName)

        if (!command) {
            logger.error(
                `No command matching ${interaction.commandName} was found`
            )
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            logger.error(
                'There was an error while executing a slash command',
                error
            )

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                })
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                })
            }
        }
    },
}
