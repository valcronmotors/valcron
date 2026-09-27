# Auction provider roadmap

Today the website only **detects** Copart, IAA, or Manheim from a pasted URL (house and lot number when the path is recognizable). It does not log in, scrape, or pull live auction data.

## Authorized work still needed

To complete automatic vehicle data later, Valcron needs a contracted/authorized integration for each house:

- Copart
- IAA
- Manheim

Until that exists, dealers complete year, make, model, mileage, title, and damage by hand **or**, for Copart, import the official Sales Data CSV (`docs/copart-integration.md`). It does not log in, scrape, or pull HTML.

“Revisa y completa la información del vehículo antes de publicarlo.”

## Public catalog

Auction opportunities stay internal. The public site only shows a **vehicle** after:

1. Opportunity
2. Review
3. Preparar para website
4. Photos and price
5. Preview
6. Publish

Internal notes never go to the public listing.
