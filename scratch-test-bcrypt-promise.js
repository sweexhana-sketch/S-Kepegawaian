import { hash } from 'bcryptjs';
const result = hash('password', 10);
console.log('Result type:', typeof result);
console.log('Is Promise:', result instanceof Promise);
result.then(h => console.log('Hashed:', h)).catch(e => console.error(e));
