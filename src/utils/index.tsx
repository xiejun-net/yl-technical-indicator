export interface ISTOCK {
    open: number, // 开盘价
    close: number, // 收盘价
    high: number, // 最高价
    low: number // 最低价
}

/**
 * 计算n周期内最高和最低
 * @param dataList
 * @returns {{ln: number, hn: number}}
 */
 export function calcHnLn(dataList: ISTOCK[] = []): {
     hn: number,
     ln: number
 } {
    let hn = Number.MIN_SAFE_INTEGER
    let ln = Number.MAX_SAFE_INTEGER
    dataList.forEach(data => {
        hn = Math.max(data.high, hn)
        ln = Math.min(data.low, ln)
    })
    return { hn, ln }
}
export * from './hq-helper.js'