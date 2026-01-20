import { Collection, Interaction, SlashCommandBuilder } from 'discord.js'
import { logger } from '../utils/logger'
import path from 'path'
import fs from 'fs'
import { SlashCommandType } from '../types/SlashCommand'

export function slashCommandHandler(
    eventDir: string = '../slash_commands'
): SlashCommandType | void {
    logger.debug(
        '[SLASH COMMAND] Beginning slash command registration process...'
    )

    const commands_collection = new Collection() as SlashCommandType

    const commandsFolderPath = path.join(__dirname, eventDir)

    if (!fs.existsSync(commandsFolderPath)) {
        logger.warn(
            `[SLASH COMMAND] Could not find slash command directory at "${commandsFolderPath}"`
        )
        return
    }

    const commandFolders = fs.readdirSync(commandsFolderPath)

    for (const commandFolder of commandFolders) {
        const commandFolderPath = path.join(commandsFolderPath, commandFolder)

        const commandFolderData = fs.statSync(commandFolderPath)

        if (!commandFolderData.isDirectory()) continue

        const commandFiles = fs
            .readdirSync(commandFolderPath)
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

        for (const commandFile of commandFiles) {
            const commandFilePath = path.join(commandFolderPath, commandFile)

            const { command } = require(commandFilePath)

            if (!command.data || !command.execute) {
                logger.warn(
                    `[SLASH COMMAND] Slash command "${commandFile}" is missing a required "data" or "execute" property`
                )
                continue
            }
            commands_collection.set(command.data.name, {
                guilds: command.guilds ?? false,
                data: command.data,
                execute: command.execute,
            })
            logger.debug(
                `[SLASH COMMAND] Successfully registered the slash command "${command.data.name}"`
            )
        }
    }

    logger.debug('[SLASH COMMAND] Successfully registered all slash commands!')
    return commands_collection
}
