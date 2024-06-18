const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load JSON data
const data = JSON.parse(fs.readFileSync('Processed_Verity_Dissection_Data_corrected.json', 'utf8'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" folder

app.post('/get-solution', (req, res) => {
    const { callout, statues } = req.body;

    if (!callout || !statues || statues.length !== 3) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const [statue1, statue2, statue3] = statues.map(s => s ? s.toLowerCase() : null);

    // Find the correct row in the data based on the statues and callout
    const row = data.find(row => row['Callout'] === callout && 
                                  row['Statue1'].toLowerCase() === statue1 &&
                                  row['Statue2'].toLowerCase() === statue2 &&
                                  row['Statue3'].toLowerCase() === statue3);

    if (row) {
        res.json({ solution: row['Solution'] });
    } else {
        res.status(404).json({ solution: 'No solution found for the given statues.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
