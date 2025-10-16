const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/upu/_msearch', (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Data:', req.body);
  res.status(200).json({ message: 'Received' });
});

const PORT = process.env.PORT || 1407;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});