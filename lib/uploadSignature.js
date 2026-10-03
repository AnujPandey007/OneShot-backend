const crypto = require('crypto');

// Cloudinary's documented signing algorithm: sorted parameters + API secret.
function signParameters(params, secret) {
  const text = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHash('sha256').update(text + secret).digest('hex');
}

function createSignatureHandler({ verifyToken, env = process.env, now = Date.now }) {
  // Per-user, per-process limit. For multiple instances use a shared rate limiter.
  const buckets = new Map();
  return async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const match = /^Bearer (\S+)$/.exec(req.get('Authorization') || '');
    if (!match) return res.status(401).json({ message: 'Please sign in before uploading an image.' });
    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const secret = env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !secret) {
      return res.status(503).json({ message: 'Image uploads are not configured on the backend yet.' });
    }
    let identity;
    try {
      identity = await verifyToken(match[1]);
      if (!identity.uid) throw new Error('Missing user');
    } catch (error) {
      const unavailable = error.code === 'upload/configuration';
      return res.status(unavailable ? 503 : 401).json({ message: unavailable
        ? 'Firebase verification is not configured on the backend.'
        : 'Your sign-in could not be verified. Please sign in again.' });
    }
    const time = now();
    for (const [key, value] of buckets) if (value.until <= time) buckets.delete(key);
    const bucket = buckets.get(identity.uid) || { count: 0, until: time + 60000 };
    if (bucket.count >= 10 || (buckets.size >= 10000 && !buckets.has(identity.uid))) {
      res.set('Retry-After', '60');
      return res.status(429).json({ message: 'Too many upload requests. Please wait a minute.' });
    }
    bucket.count += 1;
    buckets.set(identity.uid, bucket);
    const owner = crypto.createHash('sha256').update(identity.uid).digest('hex').slice(0, 24);
    // Never sign arbitrary parameters supplied by the browser.
    const params = {
      allowed_formats: 'jpg,jpeg,png,webp',
      overwrite: 'false',
      public_id: `oneshot/${owner}/${crypto.randomUUID()}`,
      timestamp: Math.floor(time / 1000),
    };
    return res.json({ cloudName, apiKey, params, signature: signParameters(params, secret) });
  };
}

module.exports = { createSignatureHandler, signParameters };
