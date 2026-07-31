const fs = require('fs');

let content = fs.readFileSync('index.js', 'utf8');

// The replacement logic:
// 1. SELECT ... pickle_appointment -> SELECT ... FROM pickle_appointment
// 2. INSERT ... pickle_appointment -> INSERT INTO pickle_appointment
// 3. LEFT ... pickle_appointment -> LEFT JOIN pickle_appointment
// 4. ' pickle_appointment SET -> 'UPDATE pickle_appointment SET
// 5. " pickle_appointment SET -> "UPDATE pickle_appointment SET
// 6. ` pickle_appointment SET -> `UPDATE pickle_appointment SET
// 7. ` pickle_appointment\n -> `UPDATE pickle_appointment\n (e.g. index.js:1203)
// 8. FROM pickle_appointment (where already fixed) shouldn't be touched.

// Let's use specific regexes based on context:
content = content.replace(/SELECT\s+(.+?)\s+pickle_appointment/g, 'SELECT $1 FROM pickle_appointment');
content = content.replace(/INSERT\s+pickle_appointment/g, 'INSERT INTO pickle_appointment');
content = content.replace(/LEFT\s+pickle_appointment/g, 'LEFT JOIN pickle_appointment');

// For UPDATE cases that start with a quote:
content = content.replace(/(['"`])\s*pickle_appointment\s+SET/g, '$1UPDATE pickle_appointment SET');
content = content.replace(/(['"`])\s*pickle_appointment\n/g, '$1UPDATE pickle_appointment\n');

// Also catch cases where it's at the start of a query string line without SET right away
content = content.replace(/^\s+pickle_appointment\s+a\s*$/gm, '       FROM pickle_appointment a');
content = content.replace(/^\s+pickle_appointment$/gm, '       FROM pickle_appointment');
content = content.replace(/^\s+pickle_appointment\s+(.+)$/gm, (match, p1) => {
    if (p1.startsWith('SET')) return match; // Handled above
    if (p1.startsWith('a ON')) return match; // Handled above? Wait, LEFT JOIN pickle_appointment a ON is handled.
    if (match.includes('UPDATE')) return match;
    if (match.includes('FROM')) return match;
    
    return match.replace(/pickle_appointment/, 'FROM pickle_appointment');
});

// Fix some manual leftovers if needed
fs.writeFileSync('index.js', content, 'utf8');
console.log('Fixed index.js');
