const imagesSection = document.getElementById("imagesSection")
const imageDaySection = document.getElementById("imageDaySection")

document.getElementById("searchForm").addEventListener("submit", async (event)=>{
    event.preventDefault();

    const searchQuery = document.getElementById("queryInput").value

    if(!searchQuery || searchQuery.trim() === ''){
        alert("Digite um valor válido para a busca")
        return;
    }

    imageDaySection.replaceChildren()
    imagesSection.replaceChildren()

    imagesSection.textContent = "Carregando..."

    const params = new URLSearchParams({
        'q': searchQuery,
    })
    const data  = await fetch(`https://images-api.nasa.gov/search?${params}`, {
    }).then(async (response) => await response.json())

    showImages(data.collection.items)
})

function showImages(images){
    console.log(images)
    
    imageDaySection.replaceChildren()
    imagesSection.replaceChildren()

    for (var image of images){

        if(!image.links) continue;

        var figure = document.createElement("figure")
        var img = document.createElement("img")
        img.src = image.links.filter((links)=>links.rel==='preview')[0].href
        img.alt = image.data[0]['description']
        figure.appendChild(img)

        var caption = document.createElement("figcaption")
        caption.textContent = `${image.data[0]['description']} - ${new Date(image.data[0]['date_created'])?.toLocaleString("pt-BR") ?? ''}`
        figure.appendChild(caption)

        imagesSection.appendChild(figure)
    }
}

async function showIOTD(){
    imageDaySection.replaceChildren()
    imagesSection.replaceChildren()

    imageDaySection.textContent = "Carregando..."

    const data = await fetch(`/api/imageDay`).then((response)=>response.json())


    console.log(data)
    
    const figure = document.createElement("figure")
    const img = document.createElement("img")
    img.src=data.hdurl
    img.alt=data.title
    figure.appendChild(img)

    const figcaption = document.createElement("figcaption")
    figcaption.textContent= data.explanation
    figure.appendChild(figcaption)

    imageDaySection.replaceChildren()
    imageDaySection.appendChild(figure)
}

showIOTD()

document.getElementById("refreshImageDay").addEventListener("click", showIOTD)