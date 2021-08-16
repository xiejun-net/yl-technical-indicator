
/**
 * 计算CR指标
 * WR：又叫中间意愿指标、价格动量指标。CR指标以上一个计算周期（如N日）的中间价比较当前周期（如日）的最高价、最低价，
 * 计算出一段时期内股价的“强弱”，从而在分析一些股价的异常波动行情时，有其独到的功能。是分析股市多空双方力量对比、
 * 把握买卖股票时机的一种中长期技术分析工具。
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */

 export function CR(dataList, calcParams = [26, 6, 10, 20, 60]) {
    let crSum = []
    let maNum = [0, 0, 0, 0]
    const crArr = []
    const maList = []
    let highSubPreMidSum = 0
    let preMidSubLowSum = 0
    let riseList = []
    let fallList = []
    const result = []
    const cr = {
        CR: 0,
        MA1: 0,
        MA2: 0,
        MA3: 0,
        MA4: 0
    }
    let preData
    dataList.forEach((kLineData, i) => {
        if (i === 0) {
            preData = kLineData
        }
        // const preMid = (preData.high + preData.close + preData.low + preData.open) / 4
        const preMid = (preData.high + preData.low) / 2

        // 上升值
        const highSubPreMid = Math.max(0, kLineData.high - preMid)
        riseList.push(highSubPreMid)
        highSubPreMidSum += highSubPreMid

        // 下跌值
        const preMidSubLow = Math.max(0, preMid - kLineData.low)
        fallList.push(preMidSubLow)
        preMidSubLowSum += preMidSubLow
        if (preMidSubLowSum !== 0) {
            cr.CR = highSubPreMidSum / preMidSubLowSum * 100
        }
        if (riseList.length === calcParams[0]) {
            highSubPreMidSum -= riseList.shift()
        }
        if (fallList.length === calcParams[0]) {
            preMidSubLowSum -= fallList.shift()
        }
        calcParams.slice(1).forEach((calcparam, j) => {
            crSum[j] = crSum[j] || 0
            crSum[j] += cr.CR
            crArr[j] = crArr[j] || []
            crArr[j].push(cr.CR)
            const forwardPeriod = Math.floor(calcparam / 2.5 + 1)
            if (crArr[j].length === calcparam) {
                maList[j] = maList[j] || []
                maList[j].push(crSum[j] / calcparam)
                maNum[j]++
                crSum[j] -= crArr[j].shift()
            }
            if (maNum[j] >= forwardPeriod) {
                let validIndex = maNum[j] - forwardPeriod - 1
                cr[`MA${j + 1}`] = maList[j][validIndex] || 0
            }
        })
        preData = kLineData
        result.push({
            ...cr
        })
    })
    return result
}
