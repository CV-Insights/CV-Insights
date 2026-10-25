function notFound(req, res) {
  return res.status(404).json({ error: "API route not found." });
}

function getMulterError(error) {
  if (error.name !== "MulterError") {
    return null;
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    return {
      status: 413,
      message: "PDF files must be 10 MB or smaller.",
    };
  }

  return {
    status: 400,
    message: "The uploaded file was not accepted.",
  };
}

function getKnownError(error) {
  const multerError = getMulterError(error);
  if (multerError) {
    return multerError;
  }

  if (error.message === "Only PDF resume files are accepted.") {
    return { status: 400, message: error.message };
  }

  if (error.code === 11000) {
    return {
      status: 409,
      message: "That email is already registered.",
    };
  }

  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    (error instanceof SyntaxError && error.status === 400)
  ) {
    return {
      status: 400,
      message: "The submitted data is invalid.",
    };
  }

  return null;
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const knownError = getKnownError(error);
  if (knownError) {
    return res.status(knownError.status).json({
      error: knownError.message,
    });
  }

  console.error("API error:", error);
  return res.status(500).json({
    error: "An unexpected server error occurred.",
  });
}

module.exports = {
  notFound,
  errorHandler,
};
