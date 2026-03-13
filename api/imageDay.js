

module.exports = async function handler(request, response) {
    const api_key = process.env.NASA_API_KEY;

    const params = new URLSearchParams({
        "api_key": api_key
    })
    const response = await fetch(`https://api.nasa.gov/planetary/apod?${params}`)
    const data = await response.json()

    return response.status(response.status).json(data)
}