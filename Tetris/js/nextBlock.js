class NextBlock {
    constructor(size) {
        this.typesQ = [];
        for(var i = 0; i<size; i++){
            this.pushRandom()
        }
    }

    pushRandom() {
        this.typesQ.push(Math.floor(Math.random() * blockType.length))
    }

    front() {
        return this.typesQ[0];
    }

    pop()  {
        this.pushRandom();
        return this.typesQ.shift();
    }

    toArray() {
        return this.typesQ;
    }
}