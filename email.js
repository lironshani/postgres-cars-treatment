const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cars.treatments@gmail.com",
    pass: "cars123tr",
  },
});

const forgotPasswordMailOptions = (email, token) => ({
  from: "Cars Treatments",
  to: email,
  subject: "Reset Password- Car Spa",
  html: `
    <h2>Click on link to reset your password</h2>
    <a href="${process.env.CLIENT_URL}/reset-password/${token}">Click here to reset</a>
    <p> Car Spa</p>
  `,
});
const signUpMailOptions = (email) => ({
  from: "Cars Treatments",
  to: email,
  subject: "Thank you for signing up to Car Spa",
  text: "You have successfully signed up to Cat Spa",
});

const mailOptions = (type, args) => {
  switch (type) {
    case "sign-up":
      return signUpMailOptions(...args);
    case "forgot-password":
      return forgotPasswordMailOptions(...args);
    default:
      return;
  }
};

const sendEmail = (type, ...args) => {
  return transporter.sendMail(mailOptions(type, args), (error, info) => {
    if (error) {
      console.log("Error: ", error);
    } else {
      console.log("Email has been sent successfully");
    }
  });
};

module.exports = sendEmail;
