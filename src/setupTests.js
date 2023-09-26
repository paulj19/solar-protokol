jest.mock('../src/context/RootApi', () => ({
    useGetClientListByPDateQuery: jest.fn(() => ({
        data: mockData,
        isLoading: false,
        isError: false,
    })),
    useDeleteClientMutation: jest.fn(() => ([jest.fn()])),
    useGetHighestClientIdQuery: jest.fn(() => ({
        data: {highestClientId: 11},
        isLoading: false,
        isError: false,
    })),
    useAddClientMutation: jest.fn(() => ([jest.fn()])),
    useUpdateHighestClientIdMutation: jest.fn(() => ([jest.fn()])),
    useGetGeneralParamsQuery: jest.fn(() => ({
        data: {
            rent: 132,
            rentDiscountPeriod: 2,
            rentDiscountRate: 11.36,
            feedInPrice: 0.08,
            inflationRate: 3,
            electricityIncreaseRate: 1,
            yearLimit: 25
        },
        isLoading: false,
        isError: false,
    })),
    useGetClientQuery: jest.fn(() => ({
        data: {
            consumptionYearly: 3500,
            unitPrice: 0.32,
            basePrice: 10,
            productionYearly: 7192,
            remarks: "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes",
            nickname: "peter walterstein",
            presentationDate: "Tue Aug 22 2023 10:30:24 GMT+0200 (Central European Summer Time)",
            status: "open",
            id: 2
        },
        isLoading: false,
        isError: false,
    })),
    useUpdateClientStatusMutation: jest.fn(() => ([jest.fn()])),
}));
export const mockData = [
    {
        "basePrice": 20,
        "consumptionYearly": 6500,
        "id": 2,
        "nickname": "peter walterstein",
        "presentationDate": "Tue Aug 22 2023 10:30:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 7192,
        "remarks": "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 1,
        "nickname": "john walter",
        "presentationDate": "Tue Aug 22 2023 10:45:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 7192,
        "remarks": "This is a remark",
        "status": "done",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 1500,
        "id": 3,
        "nickname": "mathias jeferson walterstein",
        "presentationDate": "Tue Aug 22 2023 11:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 3592,
        "remarks": "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes, maybe does not go that well, who knows, we will see",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 1500,
        "id": 4,
        "nickname": "mathias",
        "presentationDate": "Tue Aug 22 2023 12:30:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 3592,
        "remarks": "",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 4500,
        "id": 5,
        "nickname": "",
        "presentationDate": "Tue Aug 22 2023 14:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 2192,
        "remarks": "",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 6,
        "nickname": "123898",
        "presentationDate": "Tue Aug 22 2023 15:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 7192,
        "remarks": "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes, maybe does not go that well, who knows, we will see",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 7,
        "nickname": "john walter",
        "presentationDate": "Tue Aug 22 2023 16:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 5192,
        "remarks": "This is a remark",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 8,
        "nickname": "john walter",
        "presentationDate": "Tue Aug 22 2023 17:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 5192,
        "remarks": "This is a remark",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 9,
        "nickname": "123898",
        "presentationDate": "Tue Aug 22 2023 18:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 5192,
        "remarks": "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes, maybe does not go that well, who knows, we will see",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 10,
        "nickname": "abc and then 123898",
        "presentationDate": "Tue Aug 22 2023 19:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 5192,
        "remarks": "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes, maybe does not go that well, who knows, we will see",
        "status": "open",
        "unitPrice": 0.32
    },
    {
        "basePrice": 10,
        "consumptionYearly": 3500,
        "id": 11,
        "nickname": "abc and then 123898",
        "presentationDate": "Tue Aug 22 2023 20:00:24 GMT+0200 (Central European Summer Time)",
        "productionYearly": 5192,
        "remarks": "This is a remark, he is a good guy, but it is a bit long, so we will see how it goes, maybe does not go that well, who knows, we will see",
        "status": "open",
        "unitPrice": 0.32
    }
]
global.ResizeObserver = require('resize-observer-polyfill')