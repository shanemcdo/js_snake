class Bot {
    constructor(game){
        this.game = game;
    }

    move(){
        this.chase_fruit()
        if(this.will_die()) {
            console.log('will die');
        }
    }

    chase_fruit(){
        let diff = new Point(
            this.game.fruit.x - this.game.snake.head.x,
            this.game.fruit.y - this.game.snake.head.y,
        );
        if(Math.abs(diff.x) > Math.abs(diff.y)){
            this.move_x(diff.x);
        } else {
            this.move_y(diff.y);
        }
    }

    move_x(diff_x){
        if(diff_x < 0 && this.game.snake.direction != Direction.RIGHT){
            this.game.snake.direction = Direction.LEFT;
        } else if(diff_x >= 0 && this.game.snake.direction != Direction.LEFT){
            this.game.snake.direction = Direction.RIGHT;
        }
    }

    move_y(diff_y){
        if(diff_y < 0 && this.game.snake.direction != Direction.DOWN){
            this.game.snake.direction = Direction.UP;
        } else if(diff_y >= 0 && this.game.snake.direction != Direction.UP){
            this.game.snake.direction = Direction.DOWN;
        }
    }

    // check if the snake will die if it moves the current direction
    will_die(){
        let snake = this.game.snake.clone();
        snake.update(this.game.board_size_cells);
        return !snake.alive;
    }
}

