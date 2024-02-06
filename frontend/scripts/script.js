(function(){
  const connectButton = document.getElementById("connect")
  const chessDiv = document.querySelector(".game")
  const menu = document.querySelector(".menu")
  const idInput = document.getElementById("friendID") 

  connectButton.addEventListener("click", () =>{
    if(!idInput.value) return
    menu.style.transform = "translateX(0)"
    chessDiv.style.opacity = 1
  })

})()