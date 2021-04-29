const __config = require('../config.json')
const nodemailer = require("nodemailer");

class mailSender {
    constructor() {
        this.smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            port: 465,
            auth: {
                user: __config.MailSender.mail,
                pass: __config.MailSender.password
            }
        });
    }

    sendMail(email, token, callback) {
        const mailOptions = {
            to: email ,
            subject: `Please confirm your Email account`,
            html: `Hello,<br> Please Click on the link to verify your email.<br><a href=${__config.route.prod}#/VerifyEmail?token=${token}>Click here to verify</a>`
        }
        this.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                callback(error)
            } else {
                callback(response.message)
            }
        });
    }

    sendMailestimate(email, project , callback) {
        const mailOptions = {
            to: email,
            subject: `The estimate of your project is done`,
            html: `Hello,<br> You can find the estime of you project in you account HDI Design Concept, Hope it will suit you.<br><br>
            description of project : ${project.Description}
            `
        }
        this.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                callback(error)
            } else {
                callback(response.message)
            }
        });
    }

    sendPassword(email, token, callback) {
        
        const mailOptions = {
            to: email,
            subject: `Password recovery`,
            html: `Hello,<br> Please Click on the link to recover you password.<br><a href=${__config.route.prod}#/recovery?token=${token}>Click here to recovery</a>`
        }
        this.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {    
                callback(error)
            } else {
                callback(response.message)
            }
        });
    }

    sendProject(user, project, callback) {
        
        const mailOptions = {
            to: 'antony64240@gmail.com',
            subject: `Nouveau projet !`,
            html: `Bonjour,<br> 
            Vous avez un nouveau projet en attente de confirmation déposé par ${user}.<br><br> 
            Voici les détails du projet : <br>
            -Nom du projet : ${project.Name}<br>
            -Description :  ${project.Description} <br> 
            -Delais de livraison : ${new Date(parseInt(project.DateExp)).getDate()}/${new Date(parseInt(project.DateExp)).getMonth()+1}/${new Date(parseInt(project.DateExp)).getFullYear()} <br>
            <a href=${__config.route.prod}#/valideProject?token=${project.Token}>Accepter le projet</a>
            <a href=${__config.route.prod}#/refuseProject?token=${project.Token}>Refuser le projet</a>
            `
        }
        this.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {    
                callback(error)
            } else {
                callback(response.message)
            }
        });
    }
}


module.exports = mailSender;

