import dotenv from "dotenv";
dotenv.config();
import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true, 
  
  });
  
export const sendEmail = async (to: string, subject: string, templateData: object) => {
  try{

     // Render the EJS template
      const htmlContent = await ejs.renderFile(path.join(__dirname, 'templates', 'emailTemplate.ejs'), templateData);
      
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent, // Use the rendered HTML content
    });

    console.log("Email sent successfully");
  } 
  catch (error){
    console.error("Error sending email:", error);
  }
};


