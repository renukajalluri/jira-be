const nodemailer = require('nodemailer');

const checkComment = (assignee,issue )=>{
    console.log('issue',issue,assignee)
    const {comments} = issue
    // console.log('comment',comments,'issue',issued_to)
    for(let comment in comments){
        console.log('comment user',comments[comment])
        console.log('issue user',assignee.id)
        if(comments[comment].user==assignee.id){
            return true
        }
    }
    return false
}

const sendEmail =async email =>{
    try{
        const output = `
        <h2>Reminder For Issue Tracker</h2>
        `;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "dpspakurweb@gmail.com",
                pass: "xsgshqrfgyghznio",
            },
        });
        const mailOptions = {
            from: '"Admin" <dpspakurweb@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Issue Reminer", // Subject line
            html: output, // html body
        };
        const res = await transporter.sendMail(mailOptions)
        return res
    }catch(e){
        return e
    }
           
}

module.exports = {sendEmail, checkComment}