const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import funkce
const db = require('./storage/sqliteStorage');

const app = express();
const PORT = 3000;

// Zpracování JSON dat
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'FlapyThing')));


//GET požadavek na hlavní stránku
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FlapyThing', 'index.html'));
});

// Uložení skóre z hry
app.post('/api/score', (req, res) => {
    const score = Math.floor(req.body.score);

    // je vstup cislo ?
    if (typeof score !== 'number') {
        return res.status(400).json({ error: 'Neplatné score!' });
    }

    try {
        const result = db.saveScore(score);
        res.json(result);
    } catch (error) {
        console.error('Chyba při ukládání score:', error);
        res.status(500).json({ error: 'Chyba databáze.' });
    }
});

// ziskani top 10 scores
app.get('/api/scores', (req, res) => {
    try {
        const scores = db.getTopScores(); // volání funkce
        res.json(scores);
    } catch (error) {
        console.error('Chyba při získávání score:', error);
        res.status(500).json({ error: 'Nepodařilo se načíst score.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server běží na adrese http://localhost:${PORT}`);
});