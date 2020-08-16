function shuffle(arr) {
    for (var i = arr.length-1; i; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var tmp = arr[i];
        arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
}

class NextBlock {
    constructor(size) {
        this.typesQ = [];

        // bag 배열에 block 수만큼 인덱스 넣기
        this.bag = [];
        for (var i = 0; i<blockType.length; i++) {
            this.bag.push(i);
        }
        this.nextBlockSize = size;
        this.pushRandom();
    }

    pushRandom() {
        // 설정된 nextBlock type이 nextBlockSize 보다 작거나 같다면
        // 다시 this.nextBlockSize 만큼 값ㅇ르 추가한다.
        if(this.typesQ.length <= this.nextBlockSize) {
            this.bag = shuffle(this.bag); // 다시 섞는다.
            for (var i = 0; i<this.bag.length; i++) {
                this.typesQ.push(this.bag[i]);
            }
        }
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