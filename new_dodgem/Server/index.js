const express = require('express')
const app = express()

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendFile('index.html')
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})