class ErrorAnswerTimeout extends Error { }

function answerMiddle({
  timeout = 90_000,
  getKey = ctx => [ctx.updateType, ctx.chat.type, ctx.chat.id].join(':'),
  setKey = (ctx, updateType) => [updateType || ctx.updateType, ctx.chat.type, ctx.chat.id].join(':'),
  scope
} = {}) {
  const answers = new Map()
  return (ctx, next) => {
    if (!ctx.chat || scope && !scope.includes(ctx.updateType)) {
      return next()
    }

    const key = getKey(ctx)
    if (answers.has(key)) {
      return Promise.resolve(answers.get(key)(ctx.message))
    }

    ctx.answer = (updateType = 'message') => {
      let timer;
      const key = setKey(ctx, updateType)
      return new Promise((rsl, rjc) => {
        answers.set(key, rsl)
        timer = setTimeout(() => rjc(new ErrorAnswerTimeout), timeout)
      }).finally(() => {
        clearTimeout(timer)
        answers.delete(key)
      })
    }

    ctx.answerTill = (filter, ...args) => till(ctx.answer.bind(null, ...args), filter)

    return next()
  }
}

function till(answer, filter) {
  return new Promise(async (rsl, rjc) => {
    try {
      let message
      do {
        message = await answer()
        message = await filter(message)
      } while(message === undefined)
      rsl(message)
    } catch (e) {
      rjc(e)
    }
  })
}

module.exports = {
  answerMiddle,
  ErrorAnswerTimeout
}
