const nodemailer =
  require("nodemailer");

console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);

console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS
);

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS
    }
  });

const sendEmail =
  async (

    to,

    subject,

    html

  ) => {

    try {

      const info =
        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to,

          subject,

          html
        });

      console.log(
        "EMAIL SENT:",
        info.response
      );

    } catch (err) {

      console.log(
        "EMAIL ERROR:",
        err.message
      );
    }
  };

module.exports =
  sendEmail;