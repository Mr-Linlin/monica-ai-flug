const development = {
  VUE_APP_AI: 'https://ejcvirv.belikehub.com:30003',
}

const production = {
  VUE_APP_AI: 'https://ejcvirv.belikehub.com:30003',
}

let env

if (process.env.NODE_ENV === 'development') {
  env = development
} else if (process.env.NODE_ENV === 'production') {
  env = production
}

export default env
