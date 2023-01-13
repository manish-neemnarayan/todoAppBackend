const app = require("./app");
// importing port
const {PORT} = process.env;

// app listening
app.listen(PORT, () => {
    console.log("Server is listening on " + PORT);
})