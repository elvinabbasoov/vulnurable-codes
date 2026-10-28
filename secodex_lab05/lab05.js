// Lab05: Make an alert

const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

const template = `
<!DOCTYPE html>
<html>
<head>
    <title>Information Page</title>
</head>
<body>
    <h2 id="title">
        Hello
        <script nonce="<%= nonce %>">
            document.write(
                new URLSearchParams(window.location.search).get('name')
                || 'Guest'
            );
        </script>
    </h2>
</body>
</html>
`;

app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
    next();
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            'script-src': [
                "'self'",
                (req, res) => `'nonce-${res.locals.cspNonce}'`
            ]
        }
    }
}));

app.get('/', (req, res) => {
    res.type('html').send(
        ejs.render(template, {
            nonce: res.locals.cspNonce
        })
    );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
