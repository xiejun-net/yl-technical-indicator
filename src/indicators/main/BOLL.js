export function BOLL(data, calcParams = [20, 2]){
    var BOLL_N = calcParams[0],
        BOLL_P = calcParams[1],
        close,
        mid,
        upper,
        lower,
        i,
        j,
        item = [],
        val,
        std,
        sumTotal = 0
    for (i = 0; i < data.length; i++) {
        close = data[i].close
        sumTotal += close
        if (i >= (BOLL_N-1)) {
            mid = sumTotal / BOLL_N
            std = 0
            for (j = i - (BOLL_N-1); j <= i; j++) {
                val = data[j].close - mid
                std += (val * val)
            }
            std = Math.sqrt(std / BOLL_N)
            upper = mid + BOLL_P * std
            lower = mid - BOLL_P * std
            sumTotal -= data[i - (BOLL_N-1)].close
        } else {
            mid = upper = lower = 0
        }

        item.push({
            MID: mid,
            UPPER: upper,
            LOWER: lower
        })
    }
    return item
}