const mail = document.querySelector("#mail").textContent.split(" ")[8]
const images = document.querySelector(".images")
fetch("http://localhost:3000/collec?email=" + mail).then((response) => {
    response.json().then((data) => {
        for(let i=0;i<data.pics.length;i++)
        {
          console.log(data.pics[i])
          const span = document.createElement("span")
          span.innerHTML = `<img src = "Images/${data.pics[i]}">`
          images.appendChild(span)
        }  
    })
})