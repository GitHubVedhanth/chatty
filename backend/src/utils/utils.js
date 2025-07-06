import jwt  from "jsonwebtoken"

export const generatejwttoken =(userid,res)=>{
    const token  = jwt.sign(
        {userid},
        process.env.JWT_TOKEN,
        {expiresIn:'1d'}
    )
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*100,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.DEVELOPMENT !== "development"
    })

    return token
}