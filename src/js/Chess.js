class Chess {
    /**
     * @constructor
     */
    constructor() {
        this.board = new Board();
        this.engine = new Engine();
        this.current_piece = null;
        this.current_playable_squares = null;
        this.check_limitation = null;
    }

    /**
    * Start Game
    * @returns {void}
    */
    startGame() {
        this.board.createBoard();
        this.board.createPieces();
    }

    /**
    * Custom Game Creator For Tests
    * @param {Array<JSON>} pieces Custom Pieces
    * @example [{"color":"black", "piece":"pawn", "square":29}, {"color":"white", "piece":"queen", "square":12}]
    * @returns {void}
    */
    startCustomGame(pieces) {
        this.board.createBoard();
        pieces.forEach(item => {
            this.board.createPiece(item["color"], item["piece"], item["square"]);
        });
    }

    /**
     * Get Clicked Square
     * @param {Element} square Element of the clicked square('this' object comes from DOM)
     * @returns {void}
     */
    clickSquare(square) {
        let piece;
        if(isSquareHas(square.id)){
            // Control Pieces and Squares for security
            this.board.refreshBoard();
            piece = getPieceBySquareID(parseInt(square.id)); // get clicked piece

            // if player is checked then can't select any piece except king
            if(gl_checked_player == gl_current_move && piece.type != "king")
                piece = null;
        }
        
        // Select Piece Control
        if (piece && this.current_piece != piece && piece.color == gl_current_move) { 
            this.board.refreshBoard();
            this.current_piece = piece;

            // Get playable squares of clicked piece
            this.current_playable_squares = this.engine.getPlayableSquares(this.current_piece);

            // Show playable squares of clicked piece
            this.board.showPlayableSquares(this.current_playable_squares);
        } else {
            // Piece Move Control
            if (this.current_piece && this.current_piece != piece && this.current_playable_squares.includes(parseInt(square.id)) && this.current_piece != null) {
                // move piece
                this.board.movePieceOnBoard(this.current_piece, square.id);
                // is enemy player check?
                this.isCheck();
                this.endTurn();
            } else {
                this.current_piece = null;
                this.board.refreshBoard();
            }
        }
    }

    /**
     * Is enemy player checked after move?
     * @returns {void}
     */
    isCheck(){
        // Get enemy king
        const enemy_color = gl_current_move == "white" ? "black" : "white";
        const enemy_king = enemy_color == "white" ? gl_white_king : gl_black_king

        let test = enemy_king.getPlayableSquares();
        
        // Set checked player and give effect the checked king
        if(test){
            gl_checked_player = enemy_color;
            this.board.setEffectOfSquareID(enemy_king, "checked");
        }
    }

    /**
     * Change Current Move and Increase Move Count
     * @returns {void}
     */
    endTurn() {
        // Clear Table and Selected Piece
        this.board.refreshBoard();
        this.current_piece = null;

        // Set New Turn 
        if(gl_current_move == "white")
            gl_current_move = "black";
        else if(gl_current_move == "black")
            gl_current_move = "white";

        // Increase Move Count
        gl_move_count++;
    }

}
