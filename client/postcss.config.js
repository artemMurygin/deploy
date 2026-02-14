import postcssPxToRem from 'postcss-pxtorem'

export default ({ env }) => {
  const isProd = env === 'production'
  const plugin = []

  if (isProd) {
    plugin.push(
      postcssPxToRem(
        {
          propList: ['*'],
          mediaQuery: true,
        }
      )
    )
  }

  return {
    plugin,
  }
}