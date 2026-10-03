const express = require('express');
const { createSignatureHandler } = require('../lib/uploadSignature');
const { verifyUploadToken } = require('../lib/firebaseUploadAuth');

const router = express.Router();
router.post('/signature', createSignatureHandler({ verifyToken: verifyUploadToken }));
module.exports = router;
