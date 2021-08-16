
/**
 * 计算EMV指标
 * EMV：简易波动指标。是一个将价格与成交量的变化结合在一起的指标，反应的是价格运行全过程中成交量的动态变化情况。
 * <p>
 * EMV指标计算方式
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
 export function EMV(dataList, calcParams = [14, 9]) {
    let emSum = 0
    let emvSum = 0
    let priceAmpSum = 0
    let volSum = 0
    let volThan, mid, em, headNode, preNode
    const emList = []
    const result = []
    const emv = {
        EMV: 0,
        EMVA: 0
    }
    dataList.forEach((kLineData, i) => {
        const high = kLineData.high
        const low = kLineData.low
        priceAmpSum += high - low
        volSum += kLineData.volume
        if (i >= calcParams[0] - 1 && !!preNode) {
            volThan = kLineData.volume === 0 ? 0 : (volSum / calcParams[0]) / kLineData.volume
            mid = ((high + low) - (preNode.high + preNode.low)) / (high + low) * 100
            em = priceAmpSum === 0 ? 0 : mid * volThan * (high - low) / (priceAmpSum / calcParams[0])
            emList.push(em)
            emSum += em
            headNode = dataList[i - (calcParams[0] - 1)]
            volSum -= headNode.volume
            priceAmpSum -= headNode.high - headNode.low
            if (i >= (calcParams[0] * 2 - 2)) {
                emv.EMV = emSum / calcParams[0]
                emSum -= emList.shift()
                emvSum += emv.EMV
                if (i >= (calcParams[0] * 2 + calcParams[1] - 3)) {
                    emv.EMVA = emvSum / calcParams[1]
                    emvSum -= result[i - (calcParams[1] - 1)].EMV
                }
            }
        }
        preNode = kLineData
        result.push({
            ...emv
        })
    })
    return result
}
