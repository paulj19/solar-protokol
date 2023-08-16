This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

1. how reststrom when
2. which values change from user to user -> does rent change
3. will base price also change


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Domain wordings translation
### Client Specific
0. GrundPreis -> basePrice 
1. aktueller Strompreis (€ pro kWh) -> unitPrice
2. Stromverbrauch/Bedarf  pro Jahr (kWh) -> consumptionYearly
3. Stromproduktion der Anlage pro Jahr (kWh) -> productionYearly

### General
0. Einspeisevergütung -> feedInPrice
1. PV-Anlage monatl. Miete (€) -> rent
2. infaltion rate -> inflationRate
3. Erhöhung strompreis -> electricityIncreaseRate
4. Solar Rabatt dauer -> rentDiscountPeriod
5. Solar Rabatt prozent -> rentDiscountRate

### Other Terms

- Erhöhung gesamt -> totalIncreaseRate
- Kaufpreis Anlage -> purchasePrice
- Eigenverbrauch -> selfConsumptionYearly
- Netzeinspeisung pro Jahr (kWh) -> feedInElectricityYearly = selfConsumption * 
- Restbezug Strom Haushalt pro Jahr (kWh) = residualConsumptionCostYearly
- Restbezug Strom Haushalt pro Monat (kWh) = residualConsumptionCostMonthly
- Miete erste 24 Monate = discountedRent
- Einspeisevergütung gesamt pro Jahr = feedInTariffYearly
- Einspeisevergütung gesamt pro Monat = feedInTariffMonthly
- Reststromkosten Haushalt pro Monat mit PV = residualCostMonthly
- aktuelle Stromkosten pro Monat ohne PV = electricityCostMonthly

## Solar Cost

> PV_Kosten        = Rate Enpal + RestNetzBezug                                     + Grundpreis    - Einspeisevergütung \
> SolarCostMonthly = rent       + residualConsumptionMonthly * **unitPrice**        + **basePrice** - feedInTariffMonthly;

- feedInTariffMonthly = feedInGenerationMonthly   * **feedInPrice**
- feedInGenerationMonthly = (feedInGenerationYearly / 12) 
- feedInGenerationYearly = i = 1..12 => sum( solarProduction[i] - exactConsumption[i]) iff solarConsumption[i] - exactConsumption[i] > 0

- residualConsumptionCostMonthly = residualConsumptionMonthly  * **unitPrice** 
- residualConsumptionMonthly = (residualConsumptionYearly / 12);
- residualConsumptionYearly => (i = 1..12) => sum(exactConsumption[i] - solarProduction[i]) iff exactConsumption[i] - solarConsumption[i] > 0 

- exactConsumption[i] = **consumptionYearly** / 365 * *ElectricityFactor[i]* * *days[i]*
- solarProduction[i]  = **productionYearly** * *solarFactor[i]*

### Prediction

> SolarCostMonthly[year] = rent[year] + residualConsumptionCostMonthly[year]  + **basePrice**[year] - feedInTariffMonthly[year];

- residualConsumptionCostMonthly[year] = residualConsumptionMonthly  * **unitPrice**[year]
- **unitPrice**[year]= **unitPrice** * (1 + totalIncreaseRate) ** year;

- feedInTariffMonthly[year] = feedInGenerationMonthly   * **feedInPrice**[year];
- **feedInPrice**[year]= **feedInPrice** * (1 + totalIncreaseRate) ** year;

- **basePrice**[year] = **basePrice** * (1 + totalIncreaseRate) ** year;
 
- totalIncreaseRate = **inflationRate** + **electricityIncreaseRate**
## Electricity Cost

> StromKosten = GrundPreis    + Stromverbrauch/Bedarf  pro Monat(kWh) * aktueller Strompreis (€ pro kWh) * 

- StromKosten = **basePrice** + consumptionCostMonthly

- consumptionCostMonthly = consumptionMonthly * **unitPrice** ;
- consumptionMonthly = (consumptionYearly / 12) 


## Prediction
> StromKosten[year] = **basePrice**[year] + consumptionCostMonthly[year]

- consumptionCostMonthly[year] = consumptionMonthly * **unitPrice**[year];
- **unitPrice**[year]= **unitPrice** * (1 + totalIncreaseRate) ** year;

- **basePrice**[year] = **basePrice** * (1 + totalIncreaseRate) ** year;
- totalIncreaseRate = **inflationRate** + **electricityIncreaseRate**
