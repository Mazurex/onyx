import { Collection, Message } from 'discord.js'

export type DecompiledParamArray = Array<{
    name: string
    type: any
    required: boolean
}>

export interface PrefixCommand {
    params: DecompiledParamArray
    execute: (message: Message) => Promise<void>
}

export type PrefixCommandType = Collection<string, PrefixCommand>
