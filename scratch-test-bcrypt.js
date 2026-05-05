import * as bcrypt from 'bcryptjs';
console.log('bcrypt keys:', Object.keys(bcrypt));
const { hash, compare } = bcrypt;
console.log('hash:', typeof hash);
console.log('compare:', typeof compare);
