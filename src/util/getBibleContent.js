import axios from 'axios';

const getBibleContent = async (_book) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://getbible.net/json?passage=${_book}&version=kjv`)
      .then((response) => {
        const {data} = response,
          cleaned = data.substring(1, data.length - 2),
          resolution = JSON.parse(cleaned);

        resolve(resolution);
      })
      .catch((error) => {
        resolve({error: true, message: error});
      });
  });
};

export default getBibleContent;
