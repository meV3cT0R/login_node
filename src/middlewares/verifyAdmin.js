const { UnauthorizedError } = require("./errors/UnAuthorizedError");

const verifyAdmin = async (req, res, params) => {
    if(!req.role)
        throw new Error("No role Provided");
    if(!["admin"].includes(req.role))
        throw new UnauthorizedError("Unauthorized : Insufficent Permission");
}

module.exports = {verifyAdmin}
