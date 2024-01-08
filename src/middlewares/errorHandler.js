import HttpError from 'http-errors';

const GRPC_CODE_TO_HTTP_MAPPING = {
    0: 200,
    1: 499,
    2: 500,
    3: 400,
    4: 504,
    5: 404,
    6: 409,
    7: 403,
    8: 429,
    9: 412,
    10: 409,
    11: 400,
    12: 501,
    13: 500,
    14: 503,
    15: 500,
};

const STATUS_TO_MESSAGE_MAPPING = {
    200: 'OK',
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    412: 'Precondition Failed',
    429: 'Too Many Requests',
    499: 'Canceled',

    501: 'Not Implemented',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
};

export default function errorHandler(err, req, res, next) {
    if (err.metadata) { // format grpc errors
        err.status = GRPC_CODE_TO_HTTP_MAPPING[err.code] || err.code;
        if (err.details === 'Unknown Error') {
            err.details = STATUS_TO_MESSAGE_MAPPING[err.status];
        }
    }

    res.status(+err.status || 500);

    res.json({
        status: 'error',
        message: err.details || err.message,
        errors: err.errors,
        metadata: process.env.NODE_ENV !== 'production' ? err.metadata : undefined,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
}

errorHandler.notFound = (req, res, next) => {
    next(HttpError(404));
};
