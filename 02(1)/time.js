const app = require('express')();

app.get('/', (req, res) => {

    const interval = setInterval(() => {
        console.log(getTimeUTC());
    }, 3000);
    setTimeout(() => {
        clearInterval(interval);
        res.send(getTimeUTC());
    }, 15000);
})
app.listen(3000, () => {
    console.log('server is running');
})
function getTimeUTC() {
    return new Date().toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, ''); 
}