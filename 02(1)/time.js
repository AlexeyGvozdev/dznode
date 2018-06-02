const app = require('express')();
require('dotenv').config();

// console.log(process.env.PORT);


app.get('/', (req, res) => {

    const interval = setInterval(() => {
        console.log(getTimeUTC());
    }, process.env.INTERVAL);
    setTimeout(() => {
        clearInterval(interval);
        res.send(getTimeUTC());
        console.log('end');
    }, process.env.TIMEOUT);
})
app.listen(3000, () => {
    console.log('server is running');
})
function getTimeUTC() {
    return new Date().toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, ''); 
}