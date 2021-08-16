import { SMA, MAX, ABS } from '../../utils/index'

export function RSI(data){
    let RSI_N1 = this.get('N1'),
        RSI_N2 = this.get('N2'),
        RSI_N3 = this.get('N3'),
        close,
        lc,
        r,
        r1,
        r2,
        s,
        s1,
        s2,
        i,
        i1,
        i2,
        j,
        item = []

    for (j = 0; j < data.length; j++) {
        close = data[j]['close']
        if (j == 0) {
            lc = close
            r1 = s1 = i1 = 0
            r2 = s2 = i2 = 0
        } else {
            lc = data[j - 1]['close']
            r1 = SMA(MAX(close - lc, 0), RSI_N1, 1, r1)
            r2 = SMA(ABS(close - lc), RSI_N1, 1, r2)
            s1 = SMA(MAX(close - lc, 0), RSI_N2, 1, s1)
            s2 = SMA(ABS(close - lc), RSI_N2, 1, s2)
            i1 = SMA(MAX(close - lc, 0), RSI_N3, 1, i1)
            i2 = SMA(ABS(close - lc), RSI_N3, 1, i2)
        }

        r = r1 / r2 * 100 || 0
        s = s1 / s2 * 100 || 0
        i = i1 / i2 * 100 || 0
        
        item.push({
            ['RSI'+RSI_N1]: r,
            ['RSI'+RSI_N2]: s,
            ['RSI'+RSI_N3]: i,
            A: 20,
            D: 80
        })
    }

    return item

}
