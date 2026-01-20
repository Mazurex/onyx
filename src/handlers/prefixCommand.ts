import path from 'path'
import fs from 'fs'
import { logger } from '../utils/logger'
import { Collection } from 'discord.js'
import { DecompiledParamArray, PrefixCommandType } from '../types/PrefixCommand'

export function prefixCommandHandler(
    prefixCommandDir: string = '../prefix_commands'
): PrefixCommandType | void {
    logger.debug(
        '[PREFIX COMMAND] Beginning prefix command registration process...'
    )

    const commands = new Collection() as PrefixCommandType

    const commandRootFolderPath = path.join(__dirname, prefixCommandDir)

    if (!fs.existsSync(commandRootFolderPath)) {
        logger.warn(
            `[PREFIX COMMAND] Could not find prefix command directory at "${commandRootFolderPath}"`
        )
        return
    }

    const commandFolders = fs.readdirSync(commandRootFolderPath)

    for (const commandFolder of commandFolders) {
        const commandFolderPath = path.join(
            commandRootFolderPath,
            commandFolder
        )
        const commandFolderData = fs.statSync(commandFolderPath)

        if (!commandFolderData.isDirectory()) continue

        const commandFiles = fs
            .readdirSync(commandFolderPath)
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

        for (const commandFile of commandFiles) {
            const commandFilePath = path.join(commandFolderPath, commandFile)

            const { command } = require(commandFilePath)

            if (!command.usage || !command.execute) {
                logger.warn(
                    `[PREFIX COMMAND] Prefix command "${commandFile}" is missing a required "usage" or "execute" property`
                )
                continue
            }

            const commandName = command.usage.split(' ')[0]
            const decompiledCommandParams = decompilePrefixCommand(
                command.usage
            )

            commands.set(commandName, {
                params: decompiledCommandParams,
                execute: command.execute,
            })

            logger.debug(
                `[PREFIX COMMAND] Successfully registered prefix command "${commandName}"`
            )
        }
    }

    logger.debug(
        '[PREFIX COMMAND] Successfully registered all prefix commands!'
    )

    return commands
}

function decompilePrefixCommand(usage: string): DecompiledParamArray {
    const decompiledParams = [] as DecompiledParamArray

    const params = usage.split(' ')
    params.shift()

    params.forEach((param) => {
        const paramRequired = param[0] === '['

        const paramData = param
            .slice(1, -1)
            .split(':')
            .map((p) => p.trim())

        const paramName = paramData[0]
        const paramType = paramData[1]

        decompiledParams.push({
            name: paramName,
            type: paramType,
            required: paramRequired,
        })
    })

    return decompiledParams
}
