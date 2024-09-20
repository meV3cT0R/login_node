const { UnauthorizedError } = require("./errors/UnAuthorizedError");

const verifyViewer = async (req, res, params) => {
    if(!req.role)
        throw new Error("No role Provided");
    if(!["viewer","editor","admin"].includes(req.role))
        throw new UnauthorizedError("Unauthorized : Insufficent Permission");
}

module.exports = {verifyViewer}
