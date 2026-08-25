const asycnHandler = (reqHandler) => {
    return (req, res, next) => {
       Promise.resolve(reqHandler(req, res, next))
            .catch((Error) => next(Error))
    }
}

export { asycnHandler }

/* function steps
const asycnHandler = () => { }
const asycnHandler = () => () => {}
const asycnHandler = () => async() => {}
*/
/*
const asycnHandler = (fn) => async (req,res,next) => {
    try {
       await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/