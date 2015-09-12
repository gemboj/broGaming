function NodemailerAdapter(nodemailer){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ziom.ziomalowy@gmail.com',
            pass: 'ziomZiomalowy'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    this.send = function(to, message){
        var mailOptions = {
            from: 'ziom.ziomalowy@gmail.com', // sender address
            to: to, // list of receivers
            subject: 'BroGaming registration', // Subject line
            text: message // plaintext body
        };

        return new Promise(function(resolve, reject){
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    reject();
                }
                else{
                    resolve();
                }
            });
        });
    };
}