const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.static(path.join(__dirname, "webapp")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

app.listen(PORT, () => {
    console.log(`SAPUI5 app running at http://localhost:${PORT}`);
});
