const asycnHandler = (reqHandler) => {
    /* return the function which hold's the three parameter */
    /* use like (request, response, next : optional but use) */
    return (req, res, next) => {
        /*  Promise.resolve which actually get this three parameters request, respponse, next  */
       Promise.resolve(reqHandler(req, res, next))
       /* .catch have catch the error and it's give on next */
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