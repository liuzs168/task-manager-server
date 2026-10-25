
export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly code: string,
        message: string,
    ) {
        super(message);
        // this.statusCode = statusCode;
        this.name = 'AppError';
    }

    // 常用快捷工厂,业务代码里语义更清晰
    static badRequest(message = '请求参数不合法') {
        return new AppError(400, 'VALIDATION_ERROR', message);
    }
    static unauthorized(message = '未登录或 Token 无效') {
        return new AppError(401, 'UNAUTHORIZED', message);
    }
    static notFound(message = '资源不存在') {
        return new AppError(404, 'NOT_FOUND', message);
    }
    static conflict(message = '资源已存在') {
        return new AppError(409, 'CONFLICT', message);
    }
}