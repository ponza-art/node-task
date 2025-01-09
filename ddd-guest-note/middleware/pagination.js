const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    req.pagination = {
        limit,
        offset: (page - 1) * limit,
    };
    
    next();
};

module.exports = { paginationMiddleware }; 