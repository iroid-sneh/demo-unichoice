import sgMail from "@sendgrid/mail";
import path from "path";
import ejs from "ejs";
import { logo } from "../helper";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (obj, template) => {
    const data = {
        ...obj.data,
        APP_NAME: process.env.APP_NAME,
        logo: logo(),
    };

    const htmlText = await ejs.renderFile(
        path.join(`${__dirname}/../../../views/${template}/index.ejs`),
        data
    );

    const msg = {
        to: obj.to,
        from: process.env.FROM_EMAIL,
        subject: obj.subject,
        html: htmlText,
    };

    return sgMail
        .send(msg)
        .then((response) => {
            console.log(`mail sent to :- ${obj.to}`);
        })
        .catch((error) => {
            console.error("Error in Sending Email", error);
        });
};
