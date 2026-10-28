// Lab02: Submit a comment and make an alert appear.

import express from 'express';
import { marked } from 'marked';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessions = {};

function getSession(req) {
    const sid = req.query.sid;

    if (!sid || typeof sid !== 'string') {
        return {};
    }

    if (!sessions[sid]) {
        sessions[sid] = { comments: [] };
    }

    return sessions[sid];
}

app.get('/', (req, res) => {
    const session = getSession(req);

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Comment Board</title>
        </head>
        <body>
            <h1>Leave a Comment</h1>

            <form action="/comment?sid=${req.query.sid || ''}" method="POST">
                <textarea name="content" rows="6" cols="40"></textarea>
                <br>
                <button type="submit">Submit</button>
            </form>

            <h2>Comments</h2>
            ${session.comments.join('<br>')}
        </body>
        </html>
    `);
});

app.post('/comment', (req, res) => {
    const userInput = req.body.content || '';
    const renderedContent = marked.parse(userInput);

    const session = getSession(req);
    session.comments.push(renderedContent);

    res.redirect('/?sid=' + encodeURIComponent(req.query.sid || ''));
});

export default app;
