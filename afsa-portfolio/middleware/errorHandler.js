// Catches any error passed to next(err) and sends a safe response.
// Details go to the server log only, never to the visitor.
exports.notFound = (req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  // Malformed JSON bodies are the sender's mistake, not a server fault.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, error: 'Invalid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, error: 'Request too large.' });
  }
  res.status(500).json({ ok: false, error: 'Something went wrong on the server.' });
};
