import http from 'http'
import app from './app'


const server = http.createServer(app)

server.listen(app.get('port'), () =>
  console.log(`Server is running http://localhost:${app.get('port')}...`)
);

export default server
