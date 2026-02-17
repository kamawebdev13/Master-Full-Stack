

app.post('/marvel', express.json(), async(req, res) => {

    try {
        await client.connet()
        
    } catch (error) {
        
    }
})