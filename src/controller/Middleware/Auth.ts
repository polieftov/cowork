import jsonwebtoken from 'jsonwebtoken'
import {User} from "../../models/User.js";

export const loggingMiddleware = (req: any, res: any, next?: (err?: any) => any) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (err) req.user = undefined;
            User.findByPk(decode.id).then(user => {
                req.user = user;
                next();
            }).catch(ex => res.status(500).send({message: err}))
        });
    } else {
        req.user = undefined;
        next();
    }
};
