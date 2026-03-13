

export default async function handler(request, response){
    const api_key = process.env.NASA_API_KEY;
    const params = new URLSearchParams({
        "api_key": api_key
    })
    const data = await fetch(`https://api.nasa.gov/planetary/apod?${params}`).then((response)=>response.json())

    return response.status(data.status).json(data)
}