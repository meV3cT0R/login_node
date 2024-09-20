const { UnauthorizedError } = require("./errors/UnAuthorizedError");

const verifyEditor = async (req, res, params) => {
    if(!req.role)
        throw new Error("No roles Provided");
    if(!["editor","admin"].includes(req.role))
        throw new UnauthorizedError("Unauthorized : Insufficent Permission");
}

module.exports = {verifyEditor}
