const DIRS = [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
];

const DIR_POSNS = DIRS.map(dir => Point.from_dir(dir));

class Bot {
    constructor(game){
        this.game = game;
    }

    move(){
        this.move_weighted()
        // this.chase_fruit()
        if(this.will_die()) {
            this.go_first_living_direction();
        }
    }

    move_weighted(){
        const options = DIRS.map(dir => {
            const pos = Point.from_dir(dir)
                .add(this.game.snake.head);
            return {
                dir,
                pos,
                dist: this.path_dist(pos),
            }
        });
        const smallest = options.reduce((x, y) => x.dist < y.dist ? x : y);
        if(smallest.dist == Infinity){
            // TODO try to survive for as long as possible
        }else{
            this.game.snake.direction = smallest.dir;
        }
    }

    // A*
    path_dist(pos){
        if(this.out_of_bounds(pos)){
            if(this.game.loopable_walls){
                pos = pos.add(this.game.board_size_cells)
                    .mod(this.game.board_size_cells);
            } else {
                return Infinity
            }
        }
        const open = [{ pos, fscore: 0 }];
        const closed = [
            this.game.snake.head,
            ...this.game.snake.tail
        ];
        if(pos.in_list(closed)) return Infinity;
        while(open.length > 0){
            let smallest = {
                index: 0,
                value: open[0]
            };
            for(let i = 1; i < open.length; i++){
                if(open[i].pos.dist(this.game.fruit) < smallest.value.pos.dist(this.game.fruit)){
                    smallest = {
                        index: i,
                        value: {
                            pos: open[i].pos.clone(),
                            fscore: open[i].fscore,
                        }
                    };
                }
            }
            open[smallest.index] = open[open.length - 1];
            open.pop();
            if(!smallest.value.pos.in_list(closed))
                closed.push(smallest.value.pos);
            if(smallest.value.pos.equals(this.game.fruit))
                return smallest.value.fscore;
            DIR_POSNS.map(p => new Point(
                smallest.value.pos.x + p.x,
                smallest.value.pos.y + p.y,
            )).map(p => {
                if(
                    !this.game.loopable_walls
                    && this.out_of_bounds(p)
                ) return null;
                return p.add(this.game.board_size_cells)
                    .mod(this.game.board_size_cells);
            }).forEach(p => {
                if(p == null) return;
                // check if vistited
                const open_posns = open.map(item => item.pos);
                if(
                    p == null
                    || p.in_list(open_posns)
                    || p.in_list(closed)
                ) return;
                open.push({
                    pos: p,
                    fscore: smallest.value.fscore + 1,
                });
            });
        }
        return Infinity;
    }

    go_first_living_direction(){
        const dirs = shuffle([
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT,
        ]);
        for(let dir of dirs){
            console.log(dir);
            this.game.snake.direction = dir;
            if(!this.will_die()) return;
        }
    }

    chase_fruit(){
        let diff = new Point(
            this.game.fruit.x - this.game.snake.head.x,
            this.game.fruit.y - this.game.snake.head.y,
        );
        this.move_dir(diff);
    }

    move_dir(diff) {
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
        snake.update(this.game.board_size_cells, this.game.loopable_walls);
        return !snake.alive;
    }

    out_of_bounds(pos){
        return pos.x < 0
            || pos.y < 0
            || pos.x >= this.game.board_size_cells.x
            || pos.y >= this.game.board_size_cells.y
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
