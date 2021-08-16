
/**
 * 计算KDJ指标
 * EMV：随机指标。一般是用于股票分析的统计体系，根据统计学原理，通过一个特定的周期（常为9日、9周等）内出现过的最高价、最低价及
 * 最后一个计算周期的收盘价及这三者之间的比例关系，来计算最后一个计算周期的未成熟随机值RSV，然后根据平滑移动平均线的方法来计算K值、D值与J值，
 * 并绘成曲线图来研判股票价格走势。
 *
 * KDJ指标计算方式
 * 当日K值=2/3×前一日K值+1/3×当日RSV
 * 当日D值=2/3×前一日D值+1/3×当日K值
 * 若无前一日K 值与D值，则可分别用50来代替。
 * J值=3*当日K值-2*当日D值
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */

 export function KDJ(data, calcParams = [9, 3, 3]) {
    let KDJ_N = calcParams[0]
    let KDJ_M1 = calcParams[1]
    let KDJ_M2 = calcParams[2]
    let close
    let llvlow = Infinity
    let llvhigh = -Infinity
    let rsv
    let a = 0
    let b = 0
    let e
    let i
    let j
    let item = []
    for (i = 0; i < data.length; i++) {
        close = data[i]['close']
        // low = data[i]['i'];
        // high = data[i]['a'];
        llvlow = Infinity
        llvhigh = -Infinity

        if (i < KDJ_N) {
            j = 0
        } else {
            j = i - KDJ_N + 1
        }

        for (; j <= i; j++) {
            if (llvlow > data[j]['low']) {
                llvlow = data[j]['low']
            }
            if (llvhigh < data[j]['high']) {
                llvhigh = data[j]['high']
            }
        }

        rsv = (close - llvlow) / (llvhigh - llvlow) * 100
        if (isNaN(rsv) || rsv === -Infinity || rsv === Infinity) rsv = 0

        if (i < KDJ_N) {
            a = (rsv + a * i) / (i + 1)
            b = (a + b * i) / (i + 1)
        } else {
            a = (rsv + (KDJ_M1 - 1) * a) / KDJ_M1
            b = (a + (KDJ_M2 - 1) * b) / KDJ_M2
        }

        e = 3 * a - 2 * b
        item.push({
            K: a,
            D: b,
            J: e
        })
    }
    return item
}
