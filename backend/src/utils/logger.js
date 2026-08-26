const writeLog = (level, event, details = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  };

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
    return;
  }

  console.log(output);
};

const requestLogger = (request, response, next) => {
  if (request.path === '/api/health' || request.path === '/api/ready') {
    return next();
  }

  const startedAt = process.hrtime.bigint();
  const path = request.path;

  response.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    writeLog('info', 'http_request', {
      method: request.method,
      path,
      status: response.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
    });
  });

  return next();
};

const logError = (error, request, status) => {
  writeLog('error', 'http_error', {
    method: request.method,
    path: request.path,
    status,
    errorType: error.name || 'Error',
  });
};

module.exports = { logError, requestLogger, writeLog };
