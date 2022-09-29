const axios = require('axios');

const start = async (id, username) => {
    const response = await axios.get('http://localhost:3000/start', {
        id: id,
        username: username
    });
    if (response.status != 200) {
        throw new Error('Error creating user');
    }
}

module.exports = {
    start,
}