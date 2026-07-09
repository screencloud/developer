const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

// The API access token is stored in Cloud Secret Manager for security reasons,
// as you wouldn't want this visible to the public.
// Set it once with: firebase functions:secrets:set FIVE_TOKEN
const fiveToken = defineSecret('FIVE_TOKEN');

const BASE_URL = 'https://my.15five.com/api/public';
const HIGH_FIVE_URL = `${BASE_URL}/high-five/?created_on_start=`;

const getDateMonthAgo = () => {
  const d = new Date();

  d.setMonth(d.getMonth() - 1);

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');

  return `${d.getFullYear()}-${month}-${date} 00:00:00`;
};

const createResponseObject = ({
  id,
  text,
  create_ts,
  creator_details,
  receivers,
}) => {
  return {
    id,
    text,
    creationTimestamp: create_ts,
    creatorFullName: creator_details.full_name,
    receiversList: receivers
      ? receivers.map((r) => {
          return {
            fullName: r.full_name,
          };
        })
      : [],
  };
};

const responseMapper = (responseData) => {
  return responseData.results.reduce((accumulator, currentValue) => {
    if (
      currentValue.creator_details &&
      currentValue.creator_details.full_name.toLowerCase() !== '15five'
    ) {
      accumulator.push(createResponseObject(currentValue));
    }
    return accumulator;
  }, []);
};

exports.highFives = onRequest(
  { cors: true, secrets: [fiveToken] },
  async (request, response) => {
    console.log(getDateMonthAgo());
    try {
      const res = await fetch(HIGH_FIVE_URL + getDateMonthAgo(), {
        headers: { Authorization: `Bearer ${fiveToken.value()}` },
      });

      if (!res.ok) {
        throw new Error(`15Five API responded with ${res.status}`);
      }

      const body = await res.json();

      console.log(body);
      return response.status(200).send({ data: responseMapper(body) });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .send('Sorry there was an issue fetching power ups');
    }
  },
);
