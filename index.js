const imagesSection = document.getElementById("imagesSection")
const imageDaySection = document.getElementById("imageDaySection")
const bgModal = document.querySelector(".bg-modal")

const imageDayDateInput = imageDaySection.querySelector("#dateInput")
imageDayDateInput.addEventListener("change", (event) => {
    showIOTD(event.target.value)
})

imageDayDateInput.valueAsDate = new Date()
imageDayDateInput.max  = new Date().toISOString().split("T")[0]


document.getElementById("searchForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchQuery = document.getElementById("queryInput").value

    if (!searchQuery || searchQuery.trim() === '') {
        alert("Digite um valor válido para a busca")
        return;
    }

    imageDaySection.style.display="none"
    imagesSection.replaceChildren()

    imagesSection.textContent = "Carregando..."

    const params = new URLSearchParams({
        'q': searchQuery,
    })
    const response = await fetch(`https://images-api.nasa.gov/search?${params}`)

    if (response.status != 200) {
        imagesSection.innerHTML = "<h5>Ocorreu um erro ao buscar as informações</h5>"
        return;
    }

    const data = await response.json()

    showImages(data.collection.items)
})

function showImages(images) {
    console.log(images)

    if (images.length <= 0) {
        imagesSection.style.display = "flex"
        imagesSection.textContent = "Nenhum item encontrado para a busca"
        return;
    }

    imagesSection.style.display = "grid"
    imageDaySection.style.display = "none"

    imagesSection.replaceChildren()

    images.forEach((image, index) => {

        if (!image.links || image.links.filter((link) => link.rel != "captions").length === 0) return;

        var figure = document.createElement("figure")
        var img = document.createElement("img")
        img.src = image.links.filter((links) => links.rel === 'preview')[0]?.href ?? image.links[0].href;
        img.alt = image.data[0]['description']
        figure.appendChild(img)

        var caption = document.createElement("figcaption")
        caption.textContent = `${image.data[0]['description']} - ${new Date(image.data[0]['date_created'])?.toLocaleString("pt-BR") ?? ''}`
        figure.appendChild(caption)

        figure.addEventListener("click", () => {
            setModalContent(
                image.links.filter((links) => links.rel === 'preview')[0]?.href ?? image.links[0].href,
                image.data[0].title,
                image.data[0].description)
        })

        imagesSection.appendChild(figure)
    });
}

async function showIOTD(date = new Date().toISOString().split('T')[0]) {
    imagesSection.style.display = "none"
    imageDaySection.style.display = "block"

    imageDaySection.querySelector(".content").classList.add("hide")
    imageDaySection.querySelector(".error").classList.add("hide")
    imageDaySection.querySelector(".loading").classList.remove("hide")


    const params = new URLSearchParams({
        "date": date
    })
    const response = await fetch(`/api/imageDay?${params.toString()}`)

    console.log(response.status)
    if (response.status != 200) {
        imageDaySection.querySelector(".loading").classList.add("hide")
        imageDaySection.querySelector(".content").classList.add("hide")
        imageDaySection.querySelector(".error").classList.remove("hide")
    }

    const data = await response.json()
    console.log(data)

    const figure = imageDaySection.querySelector("#dayFigure")
    if(data.media_type === 'image'){
        figure.querySelector("#dayImage").style.display = 'block'
        figure.querySelector("#dayVideo").style.display = 'none'
        const img = figure.querySelector("#dayImage")
        img.src = data.url
        img.alt = data.title

        figure.querySelector("a").href = data.hdurl|| data.url
    } else if (data.media_type==='video'){
        figure.querySelector("#dayImage").style.display = 'none'
        figure.querySelector("#dayVideo").style.display = 'block'
        const video = figure.querySelector("#dayVideo")
        video.src = data.url
        video.alt = data.title
    }

    figure.querySelector("#figureTitle").textContent = data.title
    const figcaption = figure.querySelector("#imageCaption")
    figcaption.textContent = data.explanation

    imageDaySection.querySelector(".content").classList.remove("hide")
    imageDaySection.querySelector(".loading").classList.add("hide")
    imageDaySection.querySelector(".error").classList.add("hide")
}

function setModalContent(image, title, description) {
    const modal = document.querySelector(".modal")
    modal.addEventListener("click", (event) => { event.preventDefault() })
    modal.querySelector(".modal-img").src = image

    modal.querySelector(".modal-title").textContent = title
    modal.querySelector(".modal-content").innerHTML = description

    bgModal.style.display = "flex"
    document.querySelector("body").classList.add("no-scroll")
}

bgModal.addEventListener("click", (event) => {
    if (event.target === bgModal) {
        setModalContent("", "", "")
        bgModal.style.display = "none";
        document.querySelector("body").classList.remove("no-scroll")
    }
})

showIOTD()

function getRandomDate(){
    const startDate = new Date("1995-06-16")
    const endDate = new Date()

    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

    const formatedDate = randomDate.toISOString().split("T")[0]
    imageDaySection.querySelector("#dateInput").value = formatedDate
    showIOTD(formatedDate)
}

document.getElementById("refreshImageDay").addEventListener("click", ()=>{  
    document.getElementById("queryInput").value = ""
    imageDaySection.querySelector("#dateInput").valueAsDate = new Date()
    showIOTD()
})