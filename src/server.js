const routes = require('./routes')
const Hapi = require('@hapi/hapi');



const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.route(routes)

  await server.start()
  console.log(`server Berjalan pada ${server.info.uri}`)
}

init()
