class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    equals(p){
        return this.x === p.x && this.y === p.y;
    }

    clone(){
        return new Point(this.x, this.y);
    }

    scalar_mul(scalar){
        return new Point(
            this.x * scalar,
            this.y * scalar,
        );
    }

    floor(){
        return new Point(
            Math.floor(this.x),
            Math.floor(this.y),
        );
    }

    in_list(list){
        for(let item in list)
            if(this.equals(item))
                return true;
        return false;
    }
}
