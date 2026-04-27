const express = require('express');
const app = express();

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if(req.method === 'OPTIONS') return res.sendStatus(200);
  
  const GAS = 'https://script.google.com/macros/s/AKfycbwo_knphltprHOweLhyLdeckZJyirV3nEIykSSli3T6XfFmf1NqEVdQdj9SfLLxaS8U/exec';
  const qs = new URLSearchParams(req.query).toString();
  const url = qs ? GAS + '?' + qs : GAS;
  
  const https = require('https');
  function follow(u, depth) {
    if(depth > 10) return res.status(500).send('too many redirects');
    https.get(u, function(r) {
      if(r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        return follow(r.headers.location, depth + 1);
      }
      var body = '';
      r.on('data', function(c) { body += c; });
      r.on('end', function() { res.send(body); });
    }).on('error', function(e) { res.status(500).send(JSON.stringify({ error: e.message })); });
  }
  follow(url, 0);
});

app.listen(process.env.PORT || 3000);
