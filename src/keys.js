module.exports = {

    database: {
        host: 'localhost',
        user: 'root',
        password: 'Lgro1982',
        database: 'iece_tpr'
    },
    smtpAuth: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // should be replaced with real sender's account
            user: 'iece.tpr@gmail.com',
            pass: 'acCGe2qrmSQ4vP3'
        }
    },
    SQLServer: {
        user: 'sa',
        password: 'P455w0rd',
        server: 'localhost\\SQLEXPRESS',
        database: 'IECE_DSM',
        options: {           
            enableArithAbort: false
        }
    }
}