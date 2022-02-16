require("dotenv").config()
const express = require("express")
const sequelize = require("./db")
const cros = require("cors")
const fileUpload = require("express-fileupload")
const  PORT = process.env.PORT || 5000
const models = require("./models/models")
const router = require("./routes/index")
const errorHandler = require("./middleware/ErrorHandlingMiddleware")
const app = express()
const path = require("path")

app.use(cros())
app.use(express.json())
app.use(express.static(path.resolve(__dirname , "static")))
app.use(fileUpload({}))
app.use("/api" , router)


//отработка ошибки
app.use(errorHandler)



const start = async () => {
  try{
       await sequelize.authenticate()
      await sequelize.sync()
      app.listen(PORT , () => console.log("server started no port" + PORT))
  } catch (e) {
      console.log(e)
  }
}

start()
