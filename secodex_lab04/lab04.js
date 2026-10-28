// Lab04: Retrieve a record you should not be able to access.

import express from 'express';

const app = express();

app.use(express.json());

const records = [
    {
        id: 1,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@example.test',
        department: 'Engineering',
        phoneNumber: '5550101'
    },
    {
        id: 2,
        firstName: 'Jordan',
        lastName: 'Taylor',
        email: 'jordan@example.test',
        department: 'Finance',
        phoneNumber: '5550102'
    }
];

const availableFields = [
    'id',
    'firstName',
    'lastName',
    'email',
    'department',
    'phoneNumber'
];

function filter(items, field, value) {
    return items.filter(item => item[field] === value);
}

app.post('/filterRecords', (req, res) => {
    let { field, value } = req.body ?? {};

    if (typeof field !== 'string' || !field.trim()) {
        field = 'id';
    }

    if (!availableFields.includes(field)) {
        return res.status(400).json({
            error: 'Invalid field'
        });
    }

    const results = filter(records, field, value);

    res.json(results);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
