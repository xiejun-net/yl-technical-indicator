
/**
 * 计算MACD指标
 *
 * MACD：参数快线移动平均、慢线移动平均、移动平均，
 * 默认参数值12、26、9。
 * 公式：⒈首先分别计算出收盘价12日指数平滑移动平均线与26日指数平滑移动平均线，分别记为EMA(12）与EMA(26）。
 * ⒉求这两条指数平滑移动平均线的差，即：DIFF=EMA（SHORT）－EMA（LONG）。
 * ⒊再计算DIFF的M日的平均的指数平滑移动平均线，记为DEA。
 * ⒋最后用DIFF减DEA，得MACD。MACD通常绘制成围绕零轴线波动的柱形图。MACD柱状大于0涨颜色，小于0跌颜色。
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
 export function MACD(dataList, calcParams = [12, 26, 9]) {
    let emaShort
    let emaLong
    let oldEmaShort = 0
    let oldEmaLong = 0
    let dea = 0
    let oldDea = 0
    let macd = 0
    const result = []
    dataList.forEach((kLineData, i) => {
        const close = kLineData.close
        if (i === 0) {
            emaShort = close
            emaLong = close
        } else {
            emaShort = (2 * close + (calcParams[0] - 1) * oldEmaShort) / (calcParams[0] + 1)
            emaLong = (2 * close + (calcParams[1] - 1) * oldEmaLong) / (calcParams[1] + 1)
        }

        const diff = emaShort - emaLong
        dea = (diff * 2 + oldDea * (calcParams[2] - 1)) / (calcParams[2] + 1)
        macd = (diff - dea) * 2
        oldEmaShort = emaShort
        oldEmaLong = emaLong
        oldDea = dea
        result.push({ DIFF: diff, DEA: dea, MACD: macd })
    })
    return result
}
