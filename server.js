const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  const selectedItems = req.body.items;
  
  if (!selectedItems || selectedItems.length === 0) {
    return res.status(400).send('No items selected.');
  }

  const itemsList = selectedItems.map(item => `- ${item}`).join('\n');
  const prompt = `Here are the selected items:\n${itemsList}\n\nPlease provide a review based on the selected items.`;

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  const review = data.choices[0].text.trim();

  res.send(`<h1>Review</h1><p>${review}</p>`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
