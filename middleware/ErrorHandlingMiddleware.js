const ApiError = require("../error/ApiError");

module.exports = function (err , req , res ,next){
    if(err instanceof ApiError){
       return res.status(err.status).json({massage: err.masage})
    }
    return res.status(500).json({massage: "Непредвидная ошибка!"})
}