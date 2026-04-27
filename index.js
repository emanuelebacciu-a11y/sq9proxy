const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());
app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if(req.method === 'OPTIONS') return res.sendStatus(200);
  const GAS = 'https://script.google.com/macros/s/AKfycbwo_knphltprHOweLhyLdeckZJyirV3nEIykSSli3T6XfFmf1NqEVdQdj9SfLLxaS8U/exec';
  const url = GAS + '?' + new URLSearchParams(req.query).toString();
  fetch(url, { redirect: 'follow' })
    .then(r => r.text())
    .then(t => res.send(t))
    .catch(e => res.status(500).send(JSON.stringify({ error: e.message })));
});

app.listen(process.env.PORT || 3000);
