import 'dotenv/config'
import nodemailer from 'nodemailer'

async function Mail(user) {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    // send mail with defined transport object
    await transporter.sendMail({
        from: `"P.O.S systems" <${process.env.SMTP_USER}>`, // sender address
        to: user.email, // list of receivers
        subject: user.subject, // Subject line
        text: user.text, // plain text body
        html: "<b>Hello world?</b>", // html body
    })
}

export default Mail