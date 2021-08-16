
/**
 * 计算DMA指标
 * DMA指标是平均线差指标的简称，它是一种趋势分析指标，由两条曲线组成，其中波动较快的曲线是DDD线，波动较慢的是AMA线。
 * 通过对这两条移动平均线的差值情况来分析股价的趋势，比较两条线的差值可以判断出某只股票的买入和卖出量的大小，并且可以预测未来的趋势变化。
 * 另外，对其了解较多的朋友可以发现该指标与常用的MACD指标类似，其实该指标是由MACD指标简化而来。
 * <p>
 * DMA指标计算方式
 * 1.DIF:收盘价的N1日简单移动平均-收盘价的N2日简单移动平均
 * 2.AMA=DIF的M日简单移动平均
 * 3.参数N1为10，参数N2为50，参数M为10
 * 公式：DIF:MA(CLOSE,N1)-MA(CLOSE,N2);DIFMA:MA(DIF,M)
 *
 * @param dataList
 * @param calcParams
 * @returns {[]}
 */
 export function DMA(dataList, calcParams = [10, 50, 10]) {
    const maxParam = Math.max(calcParams[0], calcParams[1])
    let closeSum1 = 0
    let closeSum2 = 0
    let dmaSum = 0
    const result = []
    dataList.forEach((kLineData, i) => {
        const dma = {
            DMA: 0,
            AMA: 0
        }
        const close = kLineData.close
        closeSum1 += close
        closeSum2 += close
        let ma1
        let ma2
        if (i >= calcParams[0] - 1) {
            ma1 = closeSum1 / calcParams[0]
            closeSum1 -= dataList[i - (calcParams[0] - 1)].close
        }
        if (i >= calcParams[1] - 1) {
            ma2 = closeSum2 / calcParams[1]
            closeSum2 -= dataList[i - (calcParams[1] - 1)].close
        }

        if (i >= maxParam - 1) {
            const dif = ma1 - ma2
            dma.DMA = dif
            dmaSum += dif
            if (i >= maxParam + calcParams[2] - 2) {
                dma.AMA = dmaSum / calcParams[2]
                dmaSum -= result[i - (calcParams[2] - 1)].dma
            }
        }
        result.push({
            ...dma
        })
    })
    return result
}
