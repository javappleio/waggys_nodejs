const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const json2csv = require('json2csv').parse;
const multer = require('multer');
const csv = require('csv-parser');

const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 3000;
const DATA_FOLDER = path.join(__dirname, 'data');

app.use(cors()); // Use the cors middleware
app.use(express.json());

// Get all JSON files
// app.get('/files', (req, res) => {
//     fs.readdir(DATA_FOLDER, (err, files) => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to read files' });
//         }
//         const jsonFiles = files.filter(file => file.endsWith('.json'));
//         res.json(jsonFiles);
//     });
// });

// Get a specific JSON file
app.get('/files/:filename', (req, res) => {
    const filePath = path.join(DATA_FOLDER, req.params.filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.json(JSON.parse(data));
    });
});

// Create a new JSON file
// app.post('/files', (req, res) => {
//     const { filename, content } = req.body;
//     const filePath = path.join(DATA_FOLDER, filename);
//     fs.writeFile(filePath, JSON.stringify(content, null, 2), err => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to create file' });
//         }
//         res.status(201).json({ message: 'File created' });
//     });
// });

// Update an existing JSON file
app.put('/files/:filename', (req, res) => {
    const filePath = path.join(DATA_FOLDER, req.params.filename);
    const content = req.body;
    fs.writeFile(filePath, JSON.stringify(content, null, 2), err => {
        if (err) {
            return res.status(500).json({ error: 'Unable to update file' });
        }
        res.json({ message: 'File updated' });
    });
});

// Delete a JSON file
// app.delete('/files/:filename', (req, res) => {
//     const filePath = path.join(DATA_FOLDER, req.params.filename);
//     fs.unlink(filePath, err => {
//         if (err) {
//             return res.status(500).json({ error: 'Unable to delete file' });
//         }
//         res.json({ message: 'File deleted' });
//     });
// });

app.get('/download/waggys_tiendas.csv', (req, res) => {
    const filePath = path.join(DATA_FOLDER, 'waggys_tiendas.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }
        try {
            const jsonData = JSON.parse(data);
            const csvData = json2csv(jsonData);
            res.header('Content-Type', 'text/csv');
            res.attachment('waggys_tiendas.csv');
            res.send(csvData);
        } catch (err) {
            res.status(500).json({ error: 'Error converting JSON to CSV' });
        }
    });
});

app.post('/upload/waggys_tiendas.csv', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const jsonData = [];
    const requiredKeys = ['Nombre', 'Coordenadas', 'Calle', 'Ciudad', 'estado', 'cp', 'Lon', 'Lan']; // Replace with actual required keys

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            jsonData.push(row);
        })
        .on('end', () => {
            const isValid = jsonData.every(item => 
                requiredKeys.every(key => item.hasOwnProperty(key))
            );

            if (!isValid) {
                return res.status(400).json({ error: 'CSV file does not have the required structure' });
            }

            fs.writeFile(path.join(DATA_FOLDER, 'waggys_tiendas.json'), JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error writing JSON file' });
                }
                res.status(200).json({ message: 'File uploaded and JSON updated successfully' });
            });
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Error processing CSV file' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

