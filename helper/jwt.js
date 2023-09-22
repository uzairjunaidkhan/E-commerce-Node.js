const expressjwt = require('express-jwt');

try {
    function authJwt(){
        const secret = process.env.key;
        return expressjwt({
            secret,    //'confidential'
            algorithms:['HS256'],
            isRevoked: isRevoked
        }).unless({
            path:[
                {url: /\/api\/product(.*)/ , method: ['GET', 'OPTIONS']},//admin will delete/update/post
                {url: /\/api\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },//admin will delete/update/post
                // {url: /\/api\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},//admin will delete/update/post
                '/api/user/login',
                '/api/user/create',
                // '/api/order/create',
                // '/api/product/list'
            ]
        })
    }

} catch (err) {
    // Pass the error to the error handling middleware
    next(err);
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }
    done()
}


module.exports = authJwt