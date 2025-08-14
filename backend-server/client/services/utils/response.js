export const ok = (res, data = {}, message = 'OK', status = 200) => {
    res.status(status).json({
        ok: true,
        message,
        data
    })
};

export const fail = (res, message = 'Error', status = 400, extra = {}) => {
    res.status(status).json({
        ok: false,
        errors: {
            message,
            ...(extra || {})
        }
    })
};