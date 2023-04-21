const axios = require('axios')

export const generateImage = async(prompt) => {
    return await axios.post('https://api.openai.com/v1/images/generations', JSON.stringify({
      'prompt': `${prompt}`,
      'n': 1,
      'size': '256x256'
  }), {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
  }).then((response) => {
      return response.data.data[0].url;
  })
    .catch((error) => {
          console.log(`Image generator failed with the error: ${error}`)
          return '';
      });
};
