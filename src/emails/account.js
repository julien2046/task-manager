const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'j.banchetti@hotmail.fr',
    subject: 'Thanks',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app. `
  }).then(() => {
    console.log('Succes')
  }).catch((e) => {
    console.log(e)
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'j.banchetti@hotmail.fr',
    subject: 'Bye bye',
    text: `Bye bye ${name}.`
  }).then(() => {
    console.log('Succes')
  }).catch((e) => {
    console.log(e)
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}