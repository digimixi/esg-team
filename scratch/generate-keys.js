import crypto from 'crypto';

// Generate SGS key pair
const sgsKeys = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
const sgsPublicJwk = sgsKeys.publicKey.export({ format: 'jwk' });
const sgsPrivateJwk = sgsKeys.privateKey.export({ format: 'jwk' });

// Generate TÜV key pair
const tuvKeys = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
const tuvPublicJwk = tuvKeys.publicKey.export({ format: 'jwk' });
const tuvPrivateJwk = tuvKeys.privateKey.export({ format: 'jwk' });

console.log('--- SGS KEYS ---');
console.log('PUBLIC JWK:', JSON.stringify(sgsPublicJwk));
console.log('PRIVATE JWK:', JSON.stringify(sgsPrivateJwk));

console.log('--- TÜV KEYS ---');
console.log('PUBLIC JWK:', JSON.stringify(tuvPublicJwk));
console.log('PRIVATE JWK:', JSON.stringify(tuvPrivateJwk));
