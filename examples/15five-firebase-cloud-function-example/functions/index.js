const functions = require('firebase-functions');
const superagent = require('superagent');

// API ACCESS TOKEN is stored in firebase config store for security reasons as you would'nt want this visible to public
const TOKEN = functions.config().five.token;
const BASE_URL = 'https://my.15five.com/api/public';
const HIGH_FIVE_URL = `${BASE_URL}/high-five/?created_on_start=`;

const getDateMonthAgo = () => {
    const d = new Date();

    d.setMonth(d.getMonth() - 1);

    const month = d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth();
    const date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();

    return `${d.getFullYear()}-${month}-${date} 00:00:00`
}

const createResponseObject = ({id, text, create_ts, creator_details, receivers}) => {
    return {
        id,
        text,
        creationTimestamp: create_ts,
        creatorFullName: creator_details.full_name,
        receiversList: receivers ? receivers.map(r => {
            return {
                fullName: r.full_name
            }
        }) : [],
    };
};

const responseMapper = (responseData) => {
    return responseData.results.reduce((accumulator, currentValue) => {
        if (currentValue.creator_details && currentValue.creator_details.full_name.toLowerCase() !== "15five") {
            accumulator.push(createResponseObject(currentValue));
        }
        return accumulator;
    }, []);
}

exports.highFives = functions.https.onRequest(async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    console.log(getDateMonthAgo());
    try {
        const res = await superagent.get(HIGH_FIVE_URL + getDateMonthAgo()).set('Authorization', `Bearer ${TOKEN}`);

        console.log(res.body)
        return response.status(200).send({data: responseMapper(res.body)});
    } catch(error) {
        return response.status(500).send('Sorry there was an issue fetching power ups')
    }
});
