const axios = require('axios');

const API_URL = 'http://localhost:8080/api/trees?page=0&size=3';

async function testGetTrees() {
    try {
        const response = await axios.get(API_URL);
        console.log("Status Code:", response.status);
        console.log("Data:", response.data);

        if (response.data && response.data.content) {
            console.log("Data contains:", response.data.content.length, "trees");
            response.data.content.forEach((tree, index) => {
                console.log(`Tree ${index + 1}:`, tree);
            });
        } else {
            console.log("No content found in response.");
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
}

testGetTrees();
