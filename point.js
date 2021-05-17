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

    static random_between(p0, p1){
        return new Point(
            Math.floor(Math.random() * (p1.x - p0.x) + p0.x),
            Math.floor(Math.random() * (p1.y - p0.y) + p0.y),
        );
    }
}
