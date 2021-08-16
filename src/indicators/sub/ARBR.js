
/**
 * 计算ARBR指标
 * AR指标是反映市场当前情况下多空双方力量发展对比的结果。它是以当日的开盘价为基点。与当日最高价相比较，依固定公式计算出来的强弱指标。
 * BR指标也是反映当前情况下多空双方力量争斗的结果。不同的是它是以前一日的收盘价为基础，与当日的最高价、最低价相比较，依固定公式计算出来的强弱指标。
 * BR指标是通过比较一段周期内的收盘价在该周期价格波动中的地位，来反映市场买卖意愿程度的技术指标。
 *
 * AR指标计算公式：
 * N日AR=N日内（H－O）之和除以N日内（O－L）之和
 * 其中：H为当日最高价；L为当日最低价；O为当日开盘价；N为设定的时间参数；一般原始参数日设定为26日。
 *
 * BR指标计算公式：
 * N日BR=N日内（H－CY）之和除以N日内（CY－L）之和
 * 其中：H—当日最高价；L—当日最低价；CY—前一交易日的收盘价；N—设定的时间参数；一般原始参数日设定为26日。
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
 export function ARBR(dataList, calcParams = [26]) {
    let arSum1 = 0
    let arSum2 = 0
    let brSum1 = 0
    let brSum2 = 0
    const result = []
    let beforeClose = 0
    const getR = (val) => {
        return Math.max(0, val)
    }
    dataList.forEach((kLineData, i) => {
        const arbr = {}
        const open = kLineData.open
        const high = kLineData.high
        const low = kLineData.low
        arSum1 += high - open
        arSum2 += open - low
        arbr.ar = arSum2 === 0 ? 0 : arSum1 / arSum2 * 100
        if (i > 0) {
            beforeClose = dataList[i - 1].close
            brSum1 += getR(high - beforeClose)
            brSum2 += getR(beforeClose - low)
            if (brSum2 === 0) {
                arbr.br = 0
            } else {
                arbr.br = brSum1 / brSum2 * 100
            }
            if (i >= calcParams[0] - 1) {
                let preData = dataList[i - (calcParams[0] - 1)]
                arSum1 -= preData.high - preData.open
                arSum2 -= preData.open - preData.low

                if (i > calcParams[0] - 1) {
                    let ppreClose = 0
                    ppreClose = dataList[i - (calcParams[0] - 1) - 1].close
                    brSum1 -= getR(preData.high - ppreClose)
                    brSum2 -= getR(ppreClose - preData.low)
                }
            }
        }

        result.push({
            AR: arbr.ar || 0,
            BR: arbr.br || 0
        })
    })
    return result
}
