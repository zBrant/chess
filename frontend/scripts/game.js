(function(){
  const connectButton = document.getElementById("connect")
  const chessDiv = document.querySelector(".game")
  const menu = document.querySelector(".menu")
  const idInput = document.getElementById("friendID") 

  // connection vars
  let peer = new Peer();
  let coon = null

  // chess vars
  let board = null
  let pieceTheme = '../assets/chessPieces/{piece}.png'
  var game = new Chess()

  connectButton.addEventListener("click", () =>{
    if(!idInput.value) return

    connect(idInput.value)
    startGame("white")
    showBoard()
  })



 function showBoard(){
   chessDiv.style.opacity = 1
   menu.style.transform = "translateX(0)"
 }

  function connect(value){
    coon = peer.connect(value)
  }

  function startGame(piecesColor){
    let config = {
      pieceTheme,
      draggable: true,
      position: 'start',
      orientation: piecesColor,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd
    }
    board = Chessboard('myBoard', config)
    updateStatus()
  }

  function connection(){
    peer.on('open', () =>{
      console.log(peer.id)
    });

    peer.on('connection', (conn) => {
      console.log("connected")
      if(!coon) {
        connect(conn.peer)
        startGame("black")
        showBoard()
      }

      conn.on('data', function (data) {
        doMove(JSON.parse(data))
      });
    });
  }


  // ------------- chess logic -------------

  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // check if is your piece
    if(orientation[0] !== piece[0]) return false 
  }

  function doMove(move){
    game.move(move)
    board.position(game.fen())
    updateStatus()
  }

  function onDrop (source, target) {
    let move = {
      from: source,
      to: target,
      promotion: 'q'
    }

    // see if the move is legal
    var valid = game.move(move)

    // back to source position
    if (!valid) return 'snapback'

    coon.send(JSON.stringify(move))
    updateStatus()
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  function onSnapEnd () {
    board.position(game.fen())
  }

  function updateStatus () {
    var status = ''

    var moveColor = (game.turn() === 'b') ? 'Black' :'White'

    // checkmate?
    if (game.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
      status = 'Game over, drawn position'
    }

    // game still on
    else {
      status = moveColor + ' to move'

      // check?
      if (game.in_check()) {
        status += ', ' + moveColor + ' is in check'
      }
    }

    console.log(status)
    console.log(game.fen())
    console.log(game.pgn())

//   $status.html(status)
//   $fen.html(game.fen())
//   $pgn.html(game.pgn())
// var $status = $('#status')
// var $fen = $('#fen')
// var $pgn = $('#pgn')
  }

  connection()
})()
