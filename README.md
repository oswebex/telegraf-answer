# Telegraf Answer
Alpha версия 0.0.1

```bash
npm i https://github.com/ioscars/telegraf-answer
```

Примеры кода
```js
const { Telegraf, Markup: m } = require('telegraf')
const { answerMiddle } = require('telegraf-answer')

const bot = new Telegraf(process.env.BOT_TOKEN, { handlerTimeout: 100 })
// Подключаем мидл
bot.use(answerMiddle({ timeout: 30_000 }))
bot.start(async ({ reply, answerTill, answer }) => {
  try {
    await reply('What is your name?')
    // Спрашивает пока не пройдет проверку
    const name = await answerTill(async ({ text = '' }) => {
      if (text.length < 4)
        return void await reply('Your name is too short')

      if (text.length > 16)
        return void await reply('Your name is too big')

      return text
    })

    await reply('What is your surname?')
    // Спрашивает один раз, возвращает message
    const { text: surname } = await answer()

    await reply(`Hello, ${name} ${surname}`)
  } catch (e) {
    return reply('Registration is failed.')
  }
})
```
