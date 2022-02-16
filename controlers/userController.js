const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const {User, Basket} = require("../models/models")
const Jwt = require("jsonwebtoken")

const generateJwt = (id , email , role) => {
  return Jwt.sign(
      {id: id, email, role},
      process.env.SECRET_KEY,
      {expressIn: '24h'}
  )
}


class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest("Некорректный email или password"))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest("Пользотель с таким email oм сущестует"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id , user.email , user.role)
        return res.status(200).json({token})
    }

    async login(req, res , next) {
        const {email , password} = req.body
        const user = await User.findOne({where : {email}})
        if (!user){
            return next(ApiError.internal("извените таеой email нету жок"))
        }
        let comparePassword = bcrypt.compareSync(password , user.password)
        if (!comparePassword){
            return next(ApiError.internal("Пароль не правельный"))
        }
        const token = generateJwt(user.id , user.email , user.role)
        return res.json({token})
    }
    async getUsers(req , res){
        const users = await User.findAll()
        return res.json(users)
    }


    async check(req, res, next) {
        const {id} = req.query
        if (!id) {
            return next(ApiError.badRequest("не задан ID"))
        }
        res.json(id)
    }
}

module.exports = new UserController()