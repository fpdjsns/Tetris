const blockType = [
    {
        name: "O",
        color: "skyblue",
        shape: [[1, 1], [1, 1]]
    },
    {
        name: "S",
        color: "red",
        shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
    },
    {
        name: "Z",
        color: "purple",
        shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
    },
    {
        name: "I",
        color: "darkred",
        shape: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]]
    },
    {
        name: "T",
        color: "#FFD300",
        shape: [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
    },
    {
        name: "L",
        color: "green",
        shape: [[1, 1, 1], [1, 0, 0], [0, 0, 0]]
    },
    {
        name: "J",
        color: "blue",
        shape: [[1, 1, 1], [0, 0, 1], [0, 0, 0]]
    }
];

const blockTypeMap = blockType.reduce((map, type, index, array) => {
    map[type.name] = index;
    return map;
}, new Map());

function getRotateShape(shape) {
    const length = shape.length
    const nextShape = [];
    for (let i = 0; i < length; i++) nextShape[i] = [];
    for (let i = 0; i < length; i++)
        for (let j = 0; j < length; j++)
            nextShape[length - 1 - j][i] = shape[i][j];
    return nextShape;
}

var getBlockTypeIndex = function (blockType) {
    return blockTypeMap[blockType.name];
}
