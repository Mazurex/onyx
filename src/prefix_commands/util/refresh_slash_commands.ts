import {
    Message,
    REST,
    RESTPostAPIApplicationCommandsJSONBody,
    Routes,
} from 'discord.js'
import { slash_commands } from '../../index'
import { logger } from '../../utils/logger'

export const command = {
    usage: 'reload_slash_commands',
    async execute(message: Message) {
        if (!slash_commands || slash_commands.size === 0) {
            await message.reply('There are no registered slash commands!')
            return
        }

        const globalCommands: RESTPostAPIApplicationCommandsJSONBody[] = []
        const guildCommands: Record<
            string,
            RESTPostAPIApplicationCommandsJSONBody[]
        > = {}

        slash_commands.forEach((command) => {
            if (!command.guilds) {
                globalCommands.push(command.data.toJSON())
            } else {
                command.guilds.forEach((guildId) => {
                    if (!guildCommands[guildId]) guildCommands[guildId] = []

                    guildCommands[guildId].push(command.data.toJSON())
                })
            }
        })

        const rest = new REST().setToken(process.env.DISCORD_TOKEN as string)

        try {
            await rest.put(
                Routes.applicationCommands(process.env.USER_ID as string),
                {
                    body: globalCommands,
                }
            )

            for (const [guildId, commands] of Object.entries(guildCommands)) {
                await rest.put(
                    Routes.applicationGuildCommands(
                        process.env.USER_ID as string,
                        guildId
                    ),
                    {
                        body: commands,
                    }
                )
            }
        } catch (error) {
            logger.error('Error reloading slash commands', error)
            await message.reply(
                'There was an error when reloading slash commands!'
            )
        }
    },
}
