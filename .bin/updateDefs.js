const https = require("https")
const fs = require("fs")
const path = require("path");

const url = 'https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/ScriptEditor/NetscriptDefinitions.d.ts'
const savePath = path.resolve(__dirname, '../NetscriptDefinitions.d.ts');

https.get(url, (res) => {
    const file = fs.createWriteStream(savePath)

    res.pipe(file)

    file.on('finish', () => {
        file.close()
        console.log('Netscript Type Definitions Updated')
    })

}).on("error", (err) => {
    console.log("Error: ", err.message)
})