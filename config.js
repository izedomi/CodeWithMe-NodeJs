'use strict';

module.exports = {
    'env': 'prod',
    'sessionKey': 'HelloCodeWithMe',
    url: {
        'prod': 'https://code-with-me-app.herokuapp.com',
        'dev': 'http://localhost:3000'
    },
    db: {
        'prod': process.env.DB_CONN,
        'dev': 'mongodb://localhost/codewithme'
    },
    mailer: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "godwinizedomi@gmail.com", // user email.
            pass: process.env.EMAIL_PASSWORD, // user password
        },
    }
}