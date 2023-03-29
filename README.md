# BEAR COBBLE HQ WEB-APP
**What is it?**
A web application accessed via any browser integrating all the digital tools and resources for a commercial scale (32,000+ tap) maple sugaring operation.

**What are the primary features?**
- Sensor data interface for equipment and bulk storage sensors, including current and historical sensor data and graphs.
- GPS enabled map (using Google Maps API) with overlay of all woods based infrastructure - including 500+ identified and labeled 1" mainlines, all large diameter transport lines, and road network
- Reverse Osmosis performance logging system with performance comparison tables and graphs
- Weather data featuring current information source from on-site sensors, as well as multi-source daily and hourly forecasts and graphs
- Fix list tracking system to catalog maintenance issues


## SPECIFICS
____
## Sensors
- [Smartrek Sensors](https://www.smartrek.io/) are used to monitor vacuum and tank levels.  Data from these sensors are loaded on one minute intervals via FTP to a remote webhost, and logged to a database every 30 minutes or when manually triggered.  Current and historical data is accessed via fetch and database calls from the app.
#### Vacuum
- Vacuum sensors are connected to 5 releasers servicing 5 different sections of woods, each connected to individual 10hp liquid ring vacuum pumps.  
- Monitoring vacuum is vital for an operation where nearly the entirety the harvest occurrs in an ~6 week window and production is very dependent on vacuum levels.  
- From UVM's [Maple: A Sap to Syrup Guide ](https://www.uvm.edu/sites/default/files/media/Maple_Mini_Manual.pdf)  
>Research has shown that a vacuum pump can increase sap yield by 5-7% for every Hg applied to the taphole
- For an operation of the size of Bear Cobble one might expect a average yearly production of ~15,000 gallons.  A 5% deviation from this number represents 750 gallons of syrup which in 2022 would equate to over $22,000 of revenue.  As such one can see that monitoring vacuum is vital to the success of the business.  The real time display coupled with historical recording allows for close tracking to identify which sections are experiencing leaks that need to be addressed
#### Tanks
- Tank sensors are used to monitor tank level in 5 stainless 9,000 gallon sap tanks
- Monitoring tank levels is critical in production to ensure tanks do not overflow or have drains open resulting in a loss of sap
- Tank levels are also monitored to determine sap flow rates (and RO processing rates) to plan for production activities and ensure adequate storage capacity exists during production downtime.  

![tanks](/public/bearpaw.png)

## Map




### Planned features for v3
 - Additional resources and references
    - Brix balancing tables based on current vs desired brix and volume of syrup in need of balancing
    - RO vs Evaporator runtime tables for reference to determine necessary flow rates to match RO output to evaporator consumption
    - SOPs & Sugarhouse Certification Documents
- Machine Vision capability to take input image of RO sight glasses and immediate translation to total GPH flow rates
- Weather radar