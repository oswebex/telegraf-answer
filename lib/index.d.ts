/** @format */
import { Message } from "telegraf/typings/telegram-types"
import { Middleware } from "telegraf/typings/composer"
import { TelegrafContext } from "telegraf/typings/context"

type Awaitable<T> = T extends PromiseLike<infer U> ? U : T
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type MessageBundle = UnionToIntersection<Message>

export interface Options {
  timeout?: number
}

export declare function answerMiddle<TContext extends TelegrafContext>(options?: Options): Middleware<TContext>

declare module 'telegraf/typings/context' {
  interface TelegrafContext {
    answer(): Promise<MessageBundle>
    answerTill<T>(filter: (message: MessageBundle) => T): Promise<Exclude<Awaitable<T>, undefined>>
  }
}
