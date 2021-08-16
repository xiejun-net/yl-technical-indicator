/**
 * EMA
 * @param {number} X    
 * @param {number} YPre 客户端指标解释中的 Y'
 * @param {number} N
 * @returns {number} 
 */
export const EMA = function (X, YPre, N) {
    YPre = YPre || 0
    return (2 * X + (N - 1) * YPre) / (N + 1)
}

export const MAX = function (a, b) {
    return +a > +b ? +a : +b
}

export const MIN = function (a, b) {
    return +a < +b ? +a : +b
}

/*
* 取绝对值
 */
export const ABS = function (a) {
    return Math.abs(+a)
}

export const SMA = function (x, n, m, y) {
    return (m * x + (n - m) * y) / n
}
