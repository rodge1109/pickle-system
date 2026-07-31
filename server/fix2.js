const fs = require('fs');

let content = fs.readFileSync('index.js', 'utf8');

// Fix pickle_appointment
content = content.replace(/SELECT\s+([\s\S]*?)\s+pickle_appointment/g, 'SELECT $1 FROM pickle_appointment');
content = content.replace(/INSERT\s+pickle_appointment/g, 'INSERT INTO pickle_appointment');
content = content.replace(/DELETE\s+pickle_appointment/g, 'DELETE FROM pickle_appointment');
content = content.replace(/LEFT\s+pickle_appointment/g, 'LEFT JOIN pickle_appointment');
content = content.replace(/JOIN\s+pickle_appointment/g, 'JOIN pickle_appointment');
content = content.replace(/(['"`])\s*pickle_appointment\s+SET/g, '$1UPDATE pickle_appointment SET');
content = content.replace(/(['"`])\s*pickle_appointment\n/g, '$1UPDATE pickle_appointment\n');

// Fix standalone FROM
content = content.replace(/^(\s+)pickle_appointment(\s+a)?\s*$/gm, '$1FROM pickle_appointment$2');
content = content.replace(/^(\s+)pickle_appointment\s+(.+)$/gm, (match, spaces, rest) => {
    if (rest.startsWith('SET')) return match;
    if (rest.startsWith('a ON')) return match;
    if (match.includes('UPDATE')) return match;
    if (match.includes('FROM')) return match;
    if (match.includes('JOIN')) return match;
    return spaces + 'FROM pickle_appointment ' + rest;
});

// Fix pickle_corporate_accounts
content = content.replace(/SELECT\s+([\s\S]*?)\s+pickle_corporate_accounts/g, 'SELECT $1 FROM pickle_corporate_accounts');
content = content.replace(/INSERT\s+pickle_corporate_accounts/g, 'INSERT INTO pickle_corporate_accounts');
content = content.replace(/DELETE\s+pickle_corporate_accounts/g, 'DELETE FROM pickle_corporate_accounts');
content = content.replace(/LEFT\s+pickle_corporate_accounts/g, 'LEFT JOIN pickle_corporate_accounts');
content = content.replace(/(['"`])\s*pickle_corporate_accounts\s+SET/g, '$1UPDATE pickle_corporate_accounts SET');
content = content.replace(/(['"`])\s*pickle_corporate_accounts\n/g, '$1UPDATE pickle_corporate_accounts\n');

content = content.replace(/^(\s+)pickle_corporate_accounts\s*$/gm, '$1FROM pickle_corporate_accounts');

fs.writeFileSync('index.js', content, 'utf8');
console.log('Fixed index.js completely');
