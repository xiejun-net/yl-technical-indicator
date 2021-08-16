/*
 * yl-indicator
 * @version: 1.0.0
 * last modified: 2021/8/16下午8:49:05
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ylIndicator = {}));
}(this, (function (exports) { 'use strict';

    function BOLL(data, calcParams = [20, 2]){
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
            sumTotal = 0;
        for (i = 0; i < data.length; i++) {
            close = data[i].close;
            sumTotal += close;
            if (i >= (BOLL_N-1)) {
                mid = sumTotal / BOLL_N;
                std = 0;
                for (j = i - (BOLL_N-1); j <= i; j++) {
                    val = data[j].close - mid;
                    std += (val * val);
                }
                std = Math.sqrt(std / BOLL_N);
                upper = mid + BOLL_P * std;
                lower = mid - BOLL_P * std;
                sumTotal -= data[i - (BOLL_N-1)].close;
            } else {
                mid = upper = lower = 0;
            }

            item.push({
                MID: mid,
                UPPER: upper,
                LOWER: lower
            });
        }
        return item
    }

    /**
     * EMA
     * @param {number} X    
     * @param {number} YPre 客户端指标解释中的 Y'
     * @param {number} N
     * @returns {number} 
     */
    const EMA$1 = function (X, YPre, N) {
        YPre = YPre || 0;
        return (2 * X + (N - 1) * YPre) / (N + 1)
    };

    const MAX = function (a, b) {
        return +a > +b ? +a : +b
    };

    const MIN = function (a, b) {
        return +a < +b ? +a : +b
    };

    /*
    * 取绝对值
     */
    const ABS = function (a) {
        return Math.abs(+a)
    };

    const SMA = function (x, n, m, y) {
        return (m * x + (n - m) * y) / n
    };

    /**
     * 计算n周期内最高和最低
     * @param dataList
     * @returns {{ln: number, hn: number}}
     */
    function calcHnLn(dataList) {
        if (dataList === void 0) { dataList = []; }
        var hn = Number.MIN_SAFE_INTEGER;
        var ln = Number.MAX_SAFE_INTEGER;
        dataList.forEach(function (data) {
            hn = Math.max(data.high, hn);
            ln = Math.min(data.low, ln);
        });
        return { hn: hn, ln: ln };
    }

    function EMA(data, calcParams = [ 5, 10, 20]){
        let maOption = calcParams;
        let preEmaVal = {}; // 上一次计算的值
        return data.map((item, i) => {
            let returnVal = {};
            maOption.forEach((optionItem) => {
                if (i > 0) {
                    preEmaVal[`EMA${optionItem}`] = EMA$1(item.close, preEmaVal[`EMA${optionItem}`], optionItem);
                    if (i >= optionItem) {
                        returnVal[`EMA${optionItem}`] = preEmaVal[`EMA${optionItem}`];
                    } else {
                        returnVal[`EMA${optionItem}`] = 0;
                    }
                } else {
                    returnVal[`EMA${optionItem}`] = 0;
                    preEmaVal[`EMA${optionItem}`] = 0;
                }
            });
            return returnVal
        })
    }

    function MA(data, calcParams = [ 5, 10, 20, 60, 120]){
        let maOption = calcParams;
        const configArr = [];
        return data.map((item, i) => {
            let returnVal = {};
            maOption.forEach((optionItem, j) => {
                configArr[j] = configArr[j] || {P: 0};
                configArr[j].P += item.close;
                if (i >= optionItem - 1) {
                    returnVal[`MA${optionItem}`] = configArr[j].P / optionItem;
                    configArr[j].P -= data[i - (optionItem - 1)].close;
                } else {
                    returnVal[`MA${optionItem}`] = 0;
                }
            });
            return returnVal
        })

    }

    function SAR(data, calcParams = [ 4, 2, 20]){
        let maOption = calcParams;
        let preSip;
        let preNode = null;
        let sar, sip, preSar;
        let flag = FLAGE.LONG;
        let af = maOption[1] / 100;
        let bb;
        return data.map((node, i) => {
            if (i === 0) {
                sar = node.low;
                sip = node.high;
                bb = 0;
            } else if (i < maOption[0] - 1) {
                sar = MIN(sar, node.low);
                bb = 0;
            } else if (i === maOption[0] - 1) {
                sar = MIN(sar, node.low);
                bb = sar;
            }
            if (i >= maOption[0]) {
                preSip = sip;
                if (flag === FLAGE.LONG) {
                    if (node.low < preSar) {
                        flag = FLAGE.SHORT;
                        sip = node.low;
                        af = maOption[1] / 100;
                        sar = MAX(node.high, preNode.high);
                        sar = MAX(sar, preSip + af * (sip - preSip));
                    } else {
                        flag = FLAGE.LONG;
                        if (node.high > preSip) {
                            sip = node.high;
                            af = MIN(af + maOption[1] / 100, maOption[2] / 100);
                        }
                        sar = MIN(node.low, preNode.low);
                        sar = MIN(sar, preSar + af * (sip - preSar));
                    }
                } else {
                    if (node.high > preSar) {
                        flag = FLAGE.LONG;
                        sip = node.high;
                        af = maOption[1] / 100;
                        sar = MIN(node.low, preNode.low);
                        sar = MIN(sar, preSar + af * (sip - preSip));
                    } else {
                        flag = FLAGE.SHORT;
                        if (node.low < preSip) {
                            sip = node.low;
                            af = MIN(af + maOption[1] / 100, maOption[2] / 100);
                        }
                        sar = MAX(node.high, preNode.high);
                        sar = MAX(sar, preSar + af * (sip - preSar));
                    }
                }
                bb = sar;
            }
            preNode = node;
            preSar = sar;
            return {BB: bb}
        })

    }

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
     function ARBR(dataList, calcParams = [26]) {
        let arSum1 = 0;
        let arSum2 = 0;
        let brSum1 = 0;
        let brSum2 = 0;
        const result = [];
        let beforeClose = 0;
        const getR = (val) => {
            return Math.max(0, val)
        };
        dataList.forEach((kLineData, i) => {
            const arbr = {};
            const open = kLineData.open;
            const high = kLineData.high;
            const low = kLineData.low;
            arSum1 += high - open;
            arSum2 += open - low;
            arbr.ar = arSum2 === 0 ? 0 : arSum1 / arSum2 * 100;
            if (i > 0) {
                beforeClose = dataList[i - 1].close;
                brSum1 += getR(high - beforeClose);
                brSum2 += getR(beforeClose - low);
                if (brSum2 === 0) {
                    arbr.br = 0;
                } else {
                    arbr.br = brSum1 / brSum2 * 100;
                }
                if (i >= calcParams[0] - 1) {
                    let preData = dataList[i - (calcParams[0] - 1)];
                    arSum1 -= preData.high - preData.open;
                    arSum2 -= preData.open - preData.low;

                    if (i > calcParams[0] - 1) {
                        let ppreClose = 0;
                        ppreClose = dataList[i - (calcParams[0] - 1) - 1].close;
                        brSum1 -= getR(preData.high - ppreClose);
                        brSum2 -= getR(ppreClose - preData.low);
                    }
                }
            }

            result.push({
                AR: arbr.ar || 0,
                BR: arbr.br || 0
            });
        });
        return result
    }

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

     function CR(dataList, calcParams = [26, 6, 10, 20, 60]) {
        let crSum = [];
        let maNum = [0, 0, 0, 0];
        const crArr = [];
        const maList = [];
        let highSubPreMidSum = 0;
        let preMidSubLowSum = 0;
        let riseList = [];
        let fallList = [];
        const result = [];
        const cr = {
            CR: 0,
            MA1: 0,
            MA2: 0,
            MA3: 0,
            MA4: 0
        };
        let preData;
        dataList.forEach((kLineData, i) => {
            if (i === 0) {
                preData = kLineData;
            }
            // const preMid = (preData.high + preData.close + preData.low + preData.open) / 4
            const preMid = (preData.high + preData.low) / 2;

            // 上升值
            const highSubPreMid = Math.max(0, kLineData.high - preMid);
            riseList.push(highSubPreMid);
            highSubPreMidSum += highSubPreMid;

            // 下跌值
            const preMidSubLow = Math.max(0, preMid - kLineData.low);
            fallList.push(preMidSubLow);
            preMidSubLowSum += preMidSubLow;
            if (preMidSubLowSum !== 0) {
                cr.CR = highSubPreMidSum / preMidSubLowSum * 100;
            }
            if (riseList.length === calcParams[0]) {
                highSubPreMidSum -= riseList.shift();
            }
            if (fallList.length === calcParams[0]) {
                preMidSubLowSum -= fallList.shift();
            }
            calcParams.slice(1).forEach((calcparam, j) => {
                crSum[j] = crSum[j] || 0;
                crSum[j] += cr.CR;
                crArr[j] = crArr[j] || [];
                crArr[j].push(cr.CR);
                const forwardPeriod = Math.floor(calcparam / 2.5 + 1);
                if (crArr[j].length === calcparam) {
                    maList[j] = maList[j] || [];
                    maList[j].push(crSum[j] / calcparam);
                    maNum[j]++;
                    crSum[j] -= crArr[j].shift();
                }
                if (maNum[j] >= forwardPeriod) {
                    let validIndex = maNum[j] - forwardPeriod - 1;
                    cr[`MA${j + 1}`] = maList[j][validIndex] || 0;
                }
            });
            preData = kLineData;
            result.push({
                ...cr
            });
        });
        return result
    }

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
     function DMA(dataList, calcParams = [10, 50, 10]) {
        const maxParam = Math.max(calcParams[0], calcParams[1]);
        let closeSum1 = 0;
        let closeSum2 = 0;
        let dmaSum = 0;
        const result = [];
        dataList.forEach((kLineData, i) => {
            const dma = {
                DMA: 0,
                AMA: 0
            };
            const close = kLineData.close;
            closeSum1 += close;
            closeSum2 += close;
            let ma1;
            let ma2;
            if (i >= calcParams[0] - 1) {
                ma1 = closeSum1 / calcParams[0];
                closeSum1 -= dataList[i - (calcParams[0] - 1)].close;
            }
            if (i >= calcParams[1] - 1) {
                ma2 = closeSum2 / calcParams[1];
                closeSum2 -= dataList[i - (calcParams[1] - 1)].close;
            }

            if (i >= maxParam - 1) {
                const dif = ma1 - ma2;
                dma.DMA = dif;
                dmaSum += dif;
                if (i >= maxParam + calcParams[2] - 2) {
                    dma.AMA = dmaSum / calcParams[2];
                    dmaSum -= result[i - (calcParams[2] - 1)].dma;
                }
            }
            result.push({
                ...dma
            });
        });
        return result
    }

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
     function EMV(dataList, calcParams = [14, 9]) {
        let emSum = 0;
        let emvSum = 0;
        let priceAmpSum = 0;
        let volSum = 0;
        let volThan, mid, em, headNode, preNode;
        const emList = [];
        const result = [];
        const emv = {
            EMV: 0,
            EMVA: 0
        };
        dataList.forEach((kLineData, i) => {
            const high = kLineData.high;
            const low = kLineData.low;
            priceAmpSum += high - low;
            volSum += kLineData.volume;
            if (i >= calcParams[0] - 1 && !!preNode) {
                volThan = kLineData.volume === 0 ? 0 : (volSum / calcParams[0]) / kLineData.volume;
                mid = ((high + low) - (preNode.high + preNode.low)) / (high + low) * 100;
                em = priceAmpSum === 0 ? 0 : mid * volThan * (high - low) / (priceAmpSum / calcParams[0]);
                emList.push(em);
                emSum += em;
                headNode = dataList[i - (calcParams[0] - 1)];
                volSum -= headNode.volume;
                priceAmpSum -= headNode.high - headNode.low;
                if (i >= (calcParams[0] * 2 - 2)) {
                    emv.EMV = emSum / calcParams[0];
                    emSum -= emList.shift();
                    emvSum += emv.EMV;
                    if (i >= (calcParams[0] * 2 + calcParams[1] - 3)) {
                        emv.EMVA = emvSum / calcParams[1];
                        emvSum -= result[i - (calcParams[1] - 1)].EMV;
                    }
                }
            }
            preNode = kLineData;
            result.push({
                ...emv
            });
        });
        return result
    }

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

     function KDJ(data, calcParams = [9, 3, 3]) {
        let KDJ_N = calcParams[0];
        let KDJ_M1 = calcParams[1];
        let KDJ_M2 = calcParams[2];
        let close;
        let llvlow = Infinity;
        let llvhigh = -Infinity;
        let rsv;
        let a = 0;
        let b = 0;
        let e;
        let i;
        let j;
        let item = [];
        for (i = 0; i < data.length; i++) {
            close = data[i]['close'];
            // low = data[i]['i'];
            // high = data[i]['a'];
            llvlow = Infinity;
            llvhigh = -Infinity;

            if (i < KDJ_N) {
                j = 0;
            } else {
                j = i - KDJ_N + 1;
            }

            for (; j <= i; j++) {
                if (llvlow > data[j]['low']) {
                    llvlow = data[j]['low'];
                }
                if (llvhigh < data[j]['high']) {
                    llvhigh = data[j]['high'];
                }
            }

            rsv = (close - llvlow) / (llvhigh - llvlow) * 100;
            if (isNaN(rsv) || rsv === -Infinity || rsv === Infinity) rsv = 0;

            if (i < KDJ_N) {
                a = (rsv + a * i) / (i + 1);
                b = (a + b * i) / (i + 1);
            } else {
                a = (rsv + (KDJ_M1 - 1) * a) / KDJ_M1;
                b = (a + (KDJ_M2 - 1) * b) / KDJ_M2;
            }

            e = 3 * a - 2 * b;
            item.push({
                K: a,
                D: b,
                J: e
            });
        }
        return item
    }

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
     function MACD(dataList, calcParams = [12, 26, 9]) {
        let emaShort;
        let emaLong;
        let oldEmaShort = 0;
        let oldEmaLong = 0;
        let dea = 0;
        let oldDea = 0;
        let macd = 0;
        const result = [];
        dataList.forEach((kLineData, i) => {
            const close = kLineData.close;
            if (i === 0) {
                emaShort = close;
                emaLong = close;
            } else {
                emaShort = (2 * close + (calcParams[0] - 1) * oldEmaShort) / (calcParams[0] + 1);
                emaLong = (2 * close + (calcParams[1] - 1) * oldEmaLong) / (calcParams[1] + 1);
            }

            const diff = emaShort - emaLong;
            dea = (diff * 2 + oldDea * (calcParams[2] - 1)) / (calcParams[2] + 1);
            macd = (diff - dea) * 2;
            oldEmaShort = emaShort;
            oldEmaLong = emaLong;
            oldDea = dea;
            result.push({ DIFF: diff, DEA: dea, MACD: macd });
        });
        return result
    }

    /**
     * 计算MAVOL指标
     *
     * <p>
     * MAVOL指标计算方式
     * MAVOL1:=MA(VOL,5);
     * MAVOL2:=MA(VOL,13);
     * MAVOL3:=MA(VOL,55),COLORRED;
     *
     * MAVOL1赋值:成交量(手)的5日简单移动平均
     * MAVOL2赋值:成交量(手)的13日简单移动平均
     * MAVOL3赋值:成交量(手)的55日简单移动平
     *
     * 若收盘价高过开盘价，成交量画红色空心实体；否则画绿色实心。
     * @param dataList
     * @param calcParams
     * @returns {[]}
     */
     function MAVOL(dataList, calcParams = [1, 5, 10, 20]) {
        const result = [];
        dataList.forEach((kLineData, i) => {
            const mavol = {};
            calcParams.forEach((param) => {
                let sum = 0;
                if (i >= param - 1) {
                    for (let j = param; j > 0; j--) {
                        sum += dataList[i - j + 1].volume;
                    }
                }
                mavol['VOL' + param] = sum / (param * 10000);
            });
            result.push({
                ...mavol
            });
        });
        return result
    }

    function RSI(data){
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
            item = [];

        for (j = 0; j < data.length; j++) {
            close = data[j]['close'];
            if (j == 0) {
                lc = close;
                r1 = s1 = i1 = 0;
                r2 = s2 = i2 = 0;
            } else {
                lc = data[j - 1]['close'];
                r1 = SMA(MAX(close - lc, 0), RSI_N1, 1, r1);
                r2 = SMA(ABS(close - lc), RSI_N1, 1, r2);
                s1 = SMA(MAX(close - lc, 0), RSI_N2, 1, s1);
                s2 = SMA(ABS(close - lc), RSI_N2, 1, s2);
                i1 = SMA(MAX(close - lc, 0), RSI_N3, 1, i1);
                i2 = SMA(ABS(close - lc), RSI_N3, 1, i2);
            }

            r = r1 / r2 * 100 || 0;
            s = s1 / s2 * 100 || 0;
            i = i1 / i2 * 100 || 0;
            
            item.push({
                ['RSI'+RSI_N1]: r,
                ['RSI'+RSI_N2]: s,
                ['RSI'+RSI_N3]: i,
                A: 20,
                D: 80
            });
        }

        return item

    }

    function WR(dataList, options, plots) {
        if (plots === void 0) { plots = [
            { key: 'WR1', title: 'WR1', type: 'line' },
            { key: 'WR2', title: 'WR2', type: 'line' }
        ]; }
        return dataList.map(function (kLineData, i) {
            // tslint:disable-next-line: no-shadowed-variable
            var wr = {
                WR1: 0,
                WR2: 0
            };
            var close = kLineData.close;
            options.forEach(function (param, index) {
                var p = param - 1;
                if (i >= p) {
                    var hln = calcHnLn(dataList.slice(i - p, i + 1));
                    var hn = hln.hn;
                    var ln = hln.ln;
                    var hnSubLn = hn - ln;
                    wr[plots[index].key] = hnSubLn === 0 ? 0 : (hn - close) / hnSubLn * 100;
                }
            });
            return wr;
        });
    }

    exports.ARBR = ARBR;
    exports.BOLL = BOLL;
    exports.CR = CR;
    exports.DMA = DMA;
    exports.EMA = EMA;
    exports.EMV = EMV;
    exports.KDJ = KDJ;
    exports.MA = MA;
    exports.MACD = MACD;
    exports.MAVOL = MAVOL;
    exports.RSI = RSI;
    exports.SAR = SAR;
    exports.WR = WR;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
