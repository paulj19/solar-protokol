import { rest } from 'msw'
import { URL_EXTERN_PREDICTION_PARAMS, URL_ENERGY_USAGE } from '@/utils/Urls';

export const handlers = [
    rest.get(URL_EXTERN_PREDICTION_PARAMS, (req, res, ctx) => {
        console.log("REQUEST")
        return res(ctx.json({
            priceBase: 10,
            inflationRate: 0.05,
            priceCurrentKwh: 0.40,
            priceEnpalMonthly: 125,
        }), ctx.status(200));
    }),
    rest.get(URL_ENERGY_USAGE, (req, res, ctx) => {
        return res(ctx.json({
            usageMonthly: 250,
            surplus: 7,
        }), ctx.status(200));
    })
]