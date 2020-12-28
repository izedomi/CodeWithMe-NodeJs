"use strict";
const nodemailer = require("nodemailer");
const config = require('../../config');

// async..await is not allowed in global scope, must use a wrapper
async function main(recipientEmail, message) {
 
    try{
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(config.mailer);

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"CodeWithMe 👻" <godwinizedomi@gmail.com>', // sender address
            to: recipientEmail, // list of receivers
            subject: "CodeWithMe Email Test ✔", // Subject line
            text: message, // plain text body
            html: "<b>"+ message +"</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        return true;
    }
    catch(e){
        console.log(e)
        return false;
    }

}

module.exports.Mailer = main;
//main().catch(console.error);
