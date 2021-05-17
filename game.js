class Game{
    cell_size = new Point(20, 20);

    constructor(board_elem){
        this.board_elem = board_elem;
        this.update_window_size();
        document.body.onresize = ()=> this.update_window_size(); // arrow function is needed
        this.snake = new Snake(
            this.board_size_cells
                .scalar_mul(0.5)
                .floor(),
            board_elem,
        );
    }

    update_window_size(){
        console.log('set');
        this.window_size = this.get_window_size();
        this.board_size_pixels = this.get_board_size_pixels();
        this.board_size_cells = this.get_board_size_cells();
        this.board_elem.style.width = this.board_size_pixels.x.toString() + "px";
        this.board_elem.style.height = this.board_size_pixels.y.toString() + "px";
    }

    get_window_size(){
        return new Point(
            window.innerWidth || document.documentElement.clientWidth || body.clientWidth,
            window.innerHeight || document.documentElement.clientHeight || body.clientHeight,
        );
    }

    get_board_size_pixels(){
        return new Point(
            this.window_size.x - this.window_size.x % this.cell_size.x,
            this.window_size.y - this.window_size.y % this.cell_size.y,
        );
    }

    get_board_size_cells(){
        return new Point(
            Math.floor(this.board_size_pixels.x / this.cell_size.x),
            Math.floor(this.board_size_pixels.y / this.cell_size.y),
        );
    }
}

class Snake{
    constructor(head, board_elem){
        this.head = head;
        this.tail = [];
        this.direction = Direction.UP;
        this.length_to_add = 2;
        this.board_elem = board_elem;
        this.head_elem = board_elem.querySelector('.head');
        this.tail_elems = [];
        this.tail_piece_elem = board_elem.querySelector('#tail-piece').content.firstElementChild.cloneNode(true);
        this.alive = true;
    }

    draw(cell_size){
        this.head_elem.style.left = (this.head.x * cell_size.x).toString() + 'px';
        this.head_elem.style.top = (this.head.y * cell_size.y).toString() + 'px';
    }

    update(board_size){
        this.tail.unshift(this.head);
        if(this.length_to_add < 1)
            this.tail.pop();
        else
            this.length_to_add--;
        switch(this.direction){
            case Direction.UP:
                this.head.y -= 1
                break;
            case Direction.DOWN:
                this.head.y += 1
                break;
            case Direction.LEFT:
                this.head.x -= 1
                break;
            case Direction.RIGHT:
                this.head.x += 1
                break;
        }

        //check if new head overlaps
        if(this.head.in_list(this.tail)
            || this.head.x < 0 || this.head.y < 0
            || this.head.x >= this.board_size_cells.x
            || this.head.y >= this.board_size_cells.y
        )
            this.alive =false;
    }
}
