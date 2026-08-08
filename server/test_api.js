const http = require('http');
http.get('http://localhost:5000/api/open-plays?email=roger@rogertonacao.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if(json.openPlays && json.openPlays.length > 0) {
      json.openPlays.forEach(p => console.log(`ID: ${p.id}, has_joined: ${p.has_joined}`));
    } else {
      console.log('No open plays found');
    }
  });
}).on('error', console.error);
