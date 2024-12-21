const axios = require('axios');
const dotenv = require('dotenv');
const {saveTransaction,getOneTransaction} = require('./controllers/transactionController');

dotenv.config();

const fetchTransactions = async () => {
    let skip = 4720000;
    const limit = 1000;
    let hasMoreData = true;

    const balancer_api_endpoint = 'https://api-v3.balancer.fi/';

    const query = `
    query getAllTx($skip:Int){
    poolEvents(
        where: {
        typeIn: [SWAP,ADD,REMOVE], 
        chainIn: [MAINNET,ARBITRUM,AVALANCHE,BASE,GNOSIS,POLYGON,ZKEVM,OPTIMISM,MODE,FRAXTAL], 
        }
        skip:$skip
    ) {
        type
        chain
        valueUSD
        timestamp
        poolId
        tx
        userAddress
    }
    }
    `;

    const oldestTransaction = await getOneTransaction()
    const oldestTimestamp = oldestTransaction ? oldestTransaction.timestamp : new Date();
    console.log(oldestTimestamp)

    while (hasMoreData) {
        console.log(`Fetching pool events with skip: ${skip}...`);

        const variables = {
            skip: skip,
        };

        try {
            const response = await axios.post(
                balancer_api_endpoint,
                { query, variables },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const poolEvents = response.data?.data?.poolEvents || [];
            if (poolEvents.length > 0) {
                for (const event of poolEvents) {
                    const eventTimestamp = new Date(event.timestamp * 1000);
                    if (eventTimestamp < oldestTimestamp) {
                        const transactionData = {
                            type: event.type,
                            chain: event.chain,
                            valueUSD: event.valueUSD,
                            timestamp: eventTimestamp,
                            poolId: event.poolId,
                            tx: event.tx,
                            userAddress: event.userAddress,
                        };

                        await saveTransaction(transactionData)
                        console.log('Transaction saved:', transactionData);
                    }
                }

                skip += limit;

                const lastEventDate = new Date(poolEvents[poolEvents.length - 1].timestamp * 1000);
                console.log(`Last transaction date in this batch: ${lastEventDate.toISOString()}`);
            } else {
                hasMoreData = false;
                console.log('No more events to fetch.');
            }
        } catch (error) {
            console.error('Error fetching pool events:', error.response?.data || error.message);
            hasMoreData = false;
        }
    }

};

module.exports = fetchTransactions