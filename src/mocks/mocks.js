import { rest } from 'msw'
import { URL_GENERAL_PARAMS, URL_CLIENT_PARAMS } from 'utils/Urls';

export const handlers = [
    rest.get(URL_GENERAL_PARAMS, (req, res, ctx) => {
        return res(ctx.json({ rent: 132, rentDiscountPeriod: 2, rentDiscountAmount : 15, feedInPrice: 0.08, inflationRate: 3, electricityIncreaseRate: 1, yearLimit: 25 }), ctx.status(200));
    }),
    rest.get(URL_CLIENT_PARAMS, (req, res, ctx) => {
        return res(ctx.json({ consumptionYearly: 3500, unitPrice: 0.32, basePrice: 10, productionYearly: 7192 }), ctx.status(200));
    })
]