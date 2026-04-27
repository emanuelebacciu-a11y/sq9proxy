const express = require('express');
const https = require('https');
const app = express();

app.use(express.json({ limit: '10mb' }));

const SUPABASE_URL = 'sjxvztqoyulqstzxqypw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqeHZ6dHFveXVscXN0enhxeXB3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI3OTQ0OCwiZXhwIjoyMDkyODU1NDQ4fQ.XLkcH-ot0xQpm3hPyRobosM2OA5ZBbssLOSICA-R2ek';

function supabaseRequest(method, path, body, cb) {
  const data = body ? JSON.stringify(body) : null;
  const opts = {
    hostname: SUPABASE_URL,
    path: path,
    method: method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    }
  };
  const req = https.request(opts, function(r) {
    var b = '';
    r.on('data', function(c) { b += c; });
    r.on('end', function() { cb(null, b); });
  });
  req.on('error', cb);
  if(data) req.write(data);
  req.end();
}

app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if(req.method === 'OPTIONS') return res.sendStatus(200);

  if(req.method === 'POST') {
    const c = req.body && req.body.c ? req.body.c : '';
    supabaseRequest('POST', '/rest/v1/data', { id: 1, payload: c }, function(err) {
      if(err) return res.json({ error: err.message });
      res.json({ ok: true });
    });
  } else {
    supabaseRequest('GET', '/rest/v1/data?id=eq.1&select=payload', null, function(err, body) {
      if(err) return res.json({ error: err.message });
      try {
        var rows = JSON.parse(body);
        res.json(rows.length ? { c: rows[0].payload } : {});
      } catch(e) { res.json({}); }
    });
  }
});

app.listen(process.env.PORT || 3000);
