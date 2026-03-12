const imagesSection = document.getElementById("imagesSection")
const imageDaySection = document.getElementById("imageDaySection")
const bgModal = document.querySelector(".bg-modal")

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
    const response  = await fetch(`https://images-api.nasa.gov/search?${params}`)
    
    if(response.status!=200){
        imagesSection.innerHTML="<h5>Ocorreu um erro ao buscar as informações</h5>"
        return;
    }
    
    const data = await response.json()

    showImages(data.collection.items)
})

function showImages(images){
    console.log(images)

    if(images.length <=0){
        imagesSection.style.display = "flex"
        imagesSection.textContent = "Nenhum item encontrado para a busca"
        return;
    }
    
    imagesSection.style.display = "grid"
    imageDaySection.style.display = "none"

    imagesSection.replaceChildren()

    images.forEach((image, index) => {

        //if(!image.links) continue;

        var figure = document.createElement("figure")
        var img = document.createElement("img")
        img.src = image.links.filter((links)=>links.rel==='preview')[0]?.href ?? image.links[0].href;
        img.alt = image.data[0]['description']
        figure.appendChild(img)

        var caption = document.createElement("figcaption")
        caption.textContent = `${image.data[0]['description']} - ${new Date(image.data[0]['date_created'])?.toLocaleString("pt-BR") ?? ''}`
        figure.appendChild(caption)
        
        figure.addEventListener("click", ()=>{
            setModalContent(
                image.links.filter((links)=>links.rel==='preview')[0]?.href ?? image.links[0].href, 
                image.data[0].title, 
                image.data[0].description)
        })

        imagesSection.appendChild(figure)
    });
}

async function showIOTD(){
    imageDaySection.replaceChildren()
    imagesSection.style.display = "none"
    imageDaySection.style.display = "block"

    imageDaySection.textContent = "Carregando..."

    const response = await fetch(`/api/imageDay`)
    
    if(response.status!=200){
        imageDaySection.innerHTML="<h5>Ocorreu um erro ao buscar as informações</h5>"
        return;
    }
    
    const data = await response.json()
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

function setModalContent(image, title, description){
    const modal = document.querySelector(".modal")
    modal.addEventListener("click",(event)=>{event.preventDefault()})
    modal.querySelector(".modal-img").src = image
    
    modal.querySelector(".modal-title").textContent = title
    modal.querySelector(".modal-content").innerHTML = description

    bgModal.style.display="flex"
    document.querySelector("body").classList.add("no-scroll")
}

bgModal.addEventListener("click", (event)=>{
    if (event.target === bgModal) {
        setModalContent("", "", "")
        bgModal.style.display = "none";
        document.querySelector("body").classList.remove("no-scroll")
    }
})

showIOTD()

document.getElementById("refreshImageDay").addEventListener("click", showIOTD)