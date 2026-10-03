let firebaseAuth;

async function verifyUploadToken(token) {
  if (!firebaseAuth) {
    try {
      const { initializeApp, cert, getApps } = require('firebase-admin/app');
      const { getAuth } = require('firebase-admin/auth');
      const account = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}');
      const projectId = process.env.FIREBASE_PROJECT_ID || 'aatmagyan-web';
      if (account.project_id !== projectId) throw new Error('Wrong Firebase project');
      const name = 'oneshot-upload-auth';
      const app = getApps().find(item => item.name === name) || initializeApp({
        credential: cert(account), projectId,
      }, name);
      firebaseAuth = getAuth(app);
    } catch (_) {
      const error = new Error('Upload authentication configuration missing or invalid');
      error.code = 'upload/configuration';
      throw error;
    }
  }
  // Also reject revoked sessions and disabled Firebase users.
  return firebaseAuth.verifyIdToken(token, true);
}

module.exports = { verifyUploadToken };
