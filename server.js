const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const PORT = process.env.PORT || 3000;
const handle = app.getRequestHandler();

app
    .prepare()
    .then(() => {
        const server = express();
        server.use((req, res, next) => {
            const hostname = req.hostname === `bearcobble.herokuapp.com` ? `bearcobble.herokuapp.com` : req.hostname;
            console.log(`Hostname: ${hostname}`)

            if (req.headers['x-forwarded-proto'] === 'http' && (req.hostname === 'bearcobble.herokuapp.com' || req.hostname === 'www.bearcobble.com')) {
                res.redirect(301, `https://${hostname}`);
                return;
            }
            res.setHeader('strict-transport-security', 'max-age=31536000; includeSubDomains; preload');
            next();
        });

        server.use(express.json())
        server.get('*', (req, res) => handle(req, res));
        server.post('*', (req, res) => handle(req, res));

        server.listen(
            PORT,
            error => {
                if (error) throw error;
                console.error(`Listening on port ${PORT}`);
            }
        );

    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
