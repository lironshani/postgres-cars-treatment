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
  subject: "Reset Password",
  html: `
    <h2>Click on link to reset your password</h2>
    <a href="${process.env.CLIENT_URL}/reset-password/${token}">Click here to reset</a>
  `,
});
const signUpMailOptions = (email) => ({
  from: "Cars Treatments",
  to: email,
  subject: "Thank you for signing up to Cars Treatments",
  text: "You have successfully signed up to Cars Treatments",
  //   html:
  //     "<h4><b>Activate Account</b></h4>" +
  //     "<p>To activate your account, please enter this URL:</p>" +
  //     "<a href=https://techstar12.herokuapp.com/activate/" +
  //     user.id +
  //     "/" +
  //     token +
  //     ">" +
  //     "https://techstar12.herokuapp.com/activate/" +
  //     user.id +
  //     "/" +
  //     token +
  //     "</a>" +
  //     "<br><br>" +
  //     "<p>--Team</p>",
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
