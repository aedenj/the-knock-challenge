import express from "express"
import parser from "body-parser"
import compression from "compression"
import routes from "./routes"
import mongoose from 'mongoose'
import { setupRoutes } from "./common"

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

setupRoutes(routes, app)

const { MONGOURI = 'mongodb://mongo:27017/sms' } = process.env
const connect = () => {
  mongoose
    .connect(MONGOURI, { useNewUrlParser: true })
    .then(() => {
      return console.log(`Successfully connected to ${MONGOURI}`)
    })
    .catch(error => {
      console.log("Error connecting to database: ", error)
      return process.exit(1)
    });

  mongoose.set('useFindAndModify', false);
};
connect();

mongoose.connection.on("disconnected", connect)

export default app
