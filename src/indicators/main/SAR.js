import { MIN, MAX } from '../../utils'

const FLAGE = {
    SHORT: 1,
    LONG: 0
}

export function SAR(data, calcParams = [ 4, 2, 20]){
    let maOption = calcParams
    let preSip
    let preNode = null
    let sar, sip, preSar
    let flag = FLAGE.LONG
    let af = maOption[1] / 100
    let bb
    return data.map((node, i) => {
        if (i === 0) {
            sar = node.low
            sip = node.high
            bb = 0
        } else if (i < maOption[0] - 1) {
            sar = MIN(sar, node.low)
            bb = 0
        } else if (i === maOption[0] - 1) {
            sar = MIN(sar, node.low)
            bb = sar
        }
        if (i >= maOption[0]) {
            preSip = sip
            if (flag === FLAGE.LONG) {
                if (node.low < preSar) {
                    flag = FLAGE.SHORT
                    sip = node.low
                    af = maOption[1] / 100
                    sar = MAX(node.high, preNode.high)
                    sar = MAX(sar, preSip + af * (sip - preSip))
                } else {
                    flag = FLAGE.LONG
                    if (node.high > preSip) {
                        sip = node.high
                        af = MIN(af + maOption[1] / 100, maOption[2] / 100)
                    }
                    sar = MIN(node.low, preNode.low)
                    sar = MIN(sar, preSar + af * (sip - preSar))
                }
            } else {
                if (node.high > preSar) {
                    flag = FLAGE.LONG
                    sip = node.high
                    af = maOption[1] / 100
                    sar = MIN(node.low, preNode.low)
                    sar = MIN(sar, preSar + af * (sip - preSip))
                } else {
                    flag = FLAGE.SHORT
                    if (node.low < preSip) {
                        sip = node.low
                        af = MIN(af + maOption[1] / 100, maOption[2] / 100)
                    }
                    sar = MAX(node.high, preNode.high)
                    sar = MAX(sar, preSar + af * (sip - preSar))
                }
            }
            bb = sar
        }
        preNode = node
        preSar = sar
        return {BB: bb}
    })

}