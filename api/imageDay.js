

module.exports = async function handler(request, response) {
    const api_key = process.env.NASA_API_KEY;

    const params = new URLSearchParams({
        "api_key": api_key
    })

    const res = await fetch(`https://api.nasa.gov/planetary/apod?${params}`)
    const data = await res.json()

    return response.status(res.status).json(data)
}