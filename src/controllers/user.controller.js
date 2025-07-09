import { asycnHandler } from '../utils/asycnHandler.js'


const registerUser = asycnHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

export { registerUser }