// Lab03: Access the admin profile.

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

const users = {
    admin: {
        password: 'Admin123!'
    }
};

function auth(req, res, next) {
    const token = req.body.session;

    if (!token) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid token'
            });
        }

        req.user = user;
        req.admin = user && user.username === 'admin';

        next();
    });
}

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (users[username]) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users[username] = { password };

    res.status(201).json({
        message: 'Registration successful'
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users[username];

    if (!user || user.password !== password) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign(
        { username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

app.post('/profile', auth, (req, res) => {
    if (req.admin) {
        return res.json({
            message: 'Administrator access granted'
        });
    }

    res.json({
        message: `Welcome to your profile, ${req.user.username}`
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
