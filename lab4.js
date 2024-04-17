function selfConnection(i, angle, x, y) {
    let offsetX;
    if ((x >= canvas.width / 4 && x <= canvas.width / 2) || (x >= 3 * canvas.width / 4)) {
        offsetX = 40;
    } else {
        offsetX = -40;
    }
    x += offsetX;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y - 15, 20, Math.PI / 1.3, Math.PI * 6.5 / 2);
    ctx.stroke();
    ctx.closePath();
    if (angle !== 0) {
        drawArrow(x, y + 6, angle);
    }
}

function drawArrow( x, y, angle) {
    const arrowheadSize = 10;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowheadSize, arrowheadSize / 2);
    ctx.lineTo(-arrowheadSize, -arrowheadSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawNodes(array) {
    for (let i = 0; i < n; i++) {
        ctx.fillStyle = '#9B4AE7';
        ctx.beginPath();
        ctx.arc(array[i].x, array[i].y, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '30px Times New Roman';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${i + 1}`, array[i].x, array[i].y);
    }
}
function swapArrayElements(arr, index1, index2) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    return arr;
}
function drawDirectedConnections(matrix, nodePositions) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 1) {
                if (Math.abs(i - j) === 5 && i !== 10 && j !== 10 ) {
                    ctx.beginPath();
                    ctx.moveTo(nodePositions[j].x, nodePositions[j].y);
                    let miY = (nodePositions[i].y + nodePositions[j].y) / 2;
                    ctx.lineTo(nodePositions[i].x - 20, miY);
                    ctx.moveTo(nodePositions[i].x - 20, miY);
                    ctx.lineTo(nodePositions[i].x, nodePositions[i].y);
                    ctx.stroke();
                    const angle = Math.atan2(miY - nodePositions[i].y, nodePositions[j].x - nodePositions[i].x);
                    const offsetX = Math.cos(angle) * 40;
                    const offsetY = Math.sin(angle) * 40;
                    drawArrow(nodePositions[j].x - offsetX, nodePositions[j].y - offsetY, angle);
                }
                else if (i !== j) {
                    ctx.beginPath();
                    ctx.moveTo(nodePositions[j].x, nodePositions[j].y);
                    if ((nodePositions[j].x < centerX / 2 && nodePositions[i].x < centerX / 2) || (nodePositions[j].x > centerX / 2 && nodePositions[i].x > centerX / 2)) {
                        ctx.lineTo(nodePositions[i].x + 20, nodePositions[i].y);
                    } else {
                        ctx.lineTo(nodePositions[i].x, nodePositions[i].y + 20);
                    }
                    ctx.stroke();
                    const angle = Math.atan2(nodePositions[j].y - nodePositions[i].y, nodePositions[j].x - nodePositions[i].x);
                    const offsetX = Math.cos(angle) * 40;
                    const offsetY = Math.sin(angle) * 40;
                    drawArrow(nodePositions[j].x - offsetX, nodePositions[j].y - offsetY, angle);
                } else {
                    const angle = nodePositions[i].x < canvas.width / 4 ? Math.PI / 6 : Math.PI * 7 / 8;
                    x2 = nodePositions[i].x;
                    y2 = nodePositions[i].y;
                    selfConnection(i, angle, x2, y2);
                }
            }
        }
    }
}
function PRNG(seed) {
    this.seed = seed;
    const m = Math.pow(2, 31);

    this.next = function() {
        this.seed = (1103515245 * this.seed + 12345) % m;
        return (this.seed / m) * 2;
    };
}
function infoAboutGraph(degrees){
    console.log("Hanging and isolated vertices:\n");
    for (let i = 0; i < n; i++) {
        if (degrees[i] === 0) {
            console.log("Vertex %d is isolated\n", (i + 1));
        }
        if (degrees[i] === 1) {
            console.log("Vertex %d is hanging\n", (i + 1));
        }
    }

    for (let i = 1; i < n; i++) {
        if (degrees[i] !== degrees[i - 1]) {
            console.log("Graph is irregular\n");
            return;
        }
    }
    console.log("Graph is regular. Degree: %d\n", degrees[0]);
}
function infoUndirected(arr, n, moreInfo = 1){
    let degrees = [];
    for (let i = 0; i < n; i++) {
        let degree = 0;
        for (let j = 0; j < n; j++) {
            if (arr[i][j] === 1) {
                degree++;
            }
        }
        degrees[i] = degree;
        console.log(`Vertex: ${i + 1}. Degree: ${degree}\n`);
    }
    if (moreInfo === 1) {
        infoAboutGraph(degrees)
    }
}
function infoDirected(arr, n, moreInfo = 1){
    let degrees = [];
    for (let i = 0; i < n; i++) {
        let inDegree = 0;
        let outDegree = 0;
        for (let j = 0; j < n; j++) {
            if (arr[i][j] === 1) {
                outDegree++;
            }
            if (arr[j][i] === 1) {
                inDegree++;
            }
        }
        degrees[i] = inDegree + outDegree;
        console.log(`Vertex: ${i + 1}. InDegree: ${inDegree}. OutDegree: ${outDegree}\n`);
    }
    if (moreInfo === 1) {
        infoAboutGraph(degrees)
    }
}
function findSquaredMatrix(matrix){
    const size = matrix.length;
    let result = new Array(size).fill(0).map(() => new Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                result[i][j] += matrix[i][k] * matrix[k][j];
            }
        }
    }
    return result;
}
function wayTwoLength(arr, twoWay, n){

    console.log("Ways length 2:\n");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (twoWay[i][j] > 0) {
                for (let k = 0; k < n; k++) {
                    if (arr[k][j] === 1 && arr[i][k] === 1) {
                        console.log(`${i + 1} -> ${k + 1} -> ${j + 1}`);
                    }
                }
            }
        }
    }
    console.log("\n");
}
function findCubedMatrix(matrix1, matrix2){
    const size = matrix1.length;
    let result = new Array(size).fill(0).map(() => new Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}

function wayThreeLength(arr, square, threeWay, n){
    console.log("Ways length 3:\n");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (threeWay[i][j] > 0 ) {
                for (let k = 0; k < n; k++) {
                    if (arr[k][j] === 1) {
                        for (let l = 0; l < n; l++) {
                            if (arr[l][k] === 1) {
                                if (arr[i][l] === 1) {
                                    console.log(`${i + 1} -> ${l + 1} -> ${k + 1} -> ${j + 1}`);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("\n");
}

function reachabilityMatrix(arr, n){
    const size = arr.length;
    let power = [...arr];

    let reachability = new Array(size).fill().map(() => new Array(size).fill(0));
    for (let i = 0; i < n; i++) {
        reachability[i][i] = 1;
    }

    for (let a = 0; a < 10; a++) {
        let temp = new Array(size).fill().map(() => new Array(size).fill(0));

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    temp[i][j] += power[i][k] * arr[k][j];
                }
            }
        }

        power = temp;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                reachability[i][j] = reachability[i][j] || power[i][j];
            }
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            reachability[i][j] = reachability[i][j] !== 0;
            if (reachability[i][j] === true){
                reachability[i][j] = 1;
            }
            else {
                reachability[i][j] = 0;
            }
        }
    }
    return reachability;
}

function findStrongComponents (arr, n){
    const size = arr.length;
    let reachSquare = new Array(size).fill().map(() => new Array(size).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                reachSquare[i][j] += arr[i][k] * arr[k][j];
            }
        }
    }
    for (let i = 1; i <= n; i++) {
        let used = new Array(n);
        let currentIndex = 0;
        for (let j = 0; j < n; j++) {
            if (reachSquare[j][j] === i) {
                used[currentIndex] = j;
                currentIndex++;

                if (j === 10) {
                    console.log("\nCount of bonds in component 1: %d\n", i);
                    console.log("Vertices in the component: ");
                    for (let k = 0; k < currentIndex; k++) {
                        console.log(used[k] + 1);
                    }
                    console.log("\n");
                }

            }
        }
    }
    console.log("\nCount of bonds in component 0: %d\n", 1);
    console.log("Vertices in the component: ");
    console.log(1);
    let flippedReach = new Array(size).fill().map(() => new Array(size).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            flippedReach[i][j] = arr[j][i];
        }
    }

    let strongConnect = new Array(size).fill().map(() => new Array(size).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            strongConnect[i][j] = arr[i][j] * flippedReach[i][j];
        }
    }

    return strongConnect;

}
function calculateCondensationGraph(sccMatrix) {
    const vertices = sccMatrix.length;
    const condensationGraph = [];

    for (let i = 0; i < vertices; i++) {
        condensationGraph.push([]);
    }

    for (let i = 0; i < vertices; i++) {
        for (let j = 0; j < vertices; j++) {
            if (sccMatrix[i][j] === 1) {
                for (let k = 0; k < vertices; k++) {
                    if (k !== j && sccMatrix[j][k] === 1) {
                        const condensationVertex = findComponentContainingVertex(sccMatrix, k);
                        if (!condensationGraph[i].includes(condensationVertex)) {
                            condensationGraph[i].push(condensationVertex);
                        }
                    }
                }
            }
        }
    }

    return condensationGraph;
}


function findComponentContainingVertex(sccMatrix, vertex) {
    for (let i = 0; i < sccMatrix.length; i++) {
        if (sccMatrix[i][vertex] === 1) {
            return i;
        }
    }
    return -1;
}

const prng = new PRNG(3317);

const n1 = 3;
const n2 = 3;
const n3 = 1;
const n4 = 7;

const n = 10 + n3;


let matrix2 = [];
let matrix3 = [];
const k1 = 1 - n3 * 0.01 - n4 * 0.01 - 0.3;
const k2 = 1 - n3 * 0.005 -n4 * 0.005 -0.27;
for (let i = 0; i < n; i++) {
    matrix2[i] = [];
    matrix3[i] = [];
    for (let j = 0; j < n; j++) {
        let num = prng.next();
        matrix3[i][j] = Math.floor(num*k2);
        matrix2[i][j] = Math.floor(num*k1);
    }
}

let matrix1 = [];
for (let i = 0; i < matrix2.length; i++) {
    matrix1[i] = [];
    for (let j = 0; j < matrix2[i].length; j++) {
        matrix1[i][j] = matrix2[i][j];
    }
}
for (let i = 0; i < matrix1.length; i++) {
    for (let j = i; j < matrix1[i].length; j++) {
        if (matrix1[i][j] !== matrix1[j][i]) {
            matrix1[i][j] = matrix1[j][i] = Math.max(matrix1[i][j], matrix1[j][i]);
        }
    }
}
console.log(`Undirected graph matrix: `);
console.log(matrix1);
console.log(`Directed graph matrix: `);
console.log(matrix2);



const nodePositions1 = [];
let radius = 300;
const centerX = 800;
const centerY = 900;
const angleIncrement = (2 * Math.PI) / (n - 1);
for (let i = 0; i < n - 1; i++) {
    const x = centerX + 400 - radius * Math.cos(i * angleIncrement);
    const y = centerY - 150 - radius * Math.sin(i * angleIncrement);
    nodePositions1.push({x: x, y: y});
}
let x1 = centerX + 400;
let y1 = centerY- 150;
nodePositions1.push({x: x1, y: y1});


const nodePositions2 = [];
for (let i = 0; i < n - 1; i++) {
    const x = centerX - 400 - radius * Math.cos(i * angleIncrement);
    const y = centerY - 150 - radius * Math.sin(i * angleIncrement);
    nodePositions2.push({x: x, y: y});
}
let x2 = centerX - 400;
let y2 = centerY- 150;
nodePositions2.push({x: x2, y: y2});

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'black';
drawDirectedConnections(matrix2, nodePositions2);
drawNodes(nodePositions2);
ctx.strokeStyle = 'black';

for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        if (matrix1[i][j] === 1) {
            ctx.beginPath();
            ctx.moveTo(nodePositions1[i].x, nodePositions1[i].y);
             if (Math.abs(i - j) === 5 && i !== 10 && j !== 10 && i < j) {
                let midY = (nodePositions1[i].y + nodePositions1[j].y) / 2;
                ctx.lineTo(nodePositions1[j].x - 20, midY);
                 ctx.moveTo(nodePositions1[j].x - 20, midY);
                 ctx.lineTo(nodePositions1[j].x, nodePositions1[j].y);
                 ctx.stroke();
            } else if (i !== j && i < j) {
                ctx.lineTo(nodePositions1[j].x, nodePositions1[j].y);
                ctx.stroke();
            }
             else if (i === j) {
                x1 = nodePositions1[i].x;
                y1 = nodePositions1[i].y;
                selfConnection(i, 0, x1, y1);
            }

        }
    }
}
drawNodes(nodePositions1);

console.log("Information about undirected graph:\n");
infoUndirected(matrix1, n);
console.log("Information about directed graph:\n");
infoDirected(matrix2, n);
console.log("Modified directed graph matrix: ");
console.log(matrix3);
const nodePositions3 = [];
for (let i = 0; i < n - 1; i++) {
    const x = centerX - radius * Math.cos(i * angleIncrement);
    const y = centerY + 550 - radius * Math.sin(i * angleIncrement);
    nodePositions3.push({x: x, y: y});
}
let x3 = centerX;
let y3 = centerY + 550;
nodePositions3.push({x: x3, y: y3});
ctx.strokeStyle = 'black';
drawDirectedConnections(matrix3, nodePositions3);
drawNodes(nodePositions3);

console.log("Information about degrees in the modified directed graph:\n");
infoDirected(matrix3, n, 0);

let twoWay = findSquaredMatrix(matrix3);
wayTwoLength(matrix3, twoWay, n)
console.log(twoWay);

let threeWay = findCubedMatrix(twoWay, matrix3);
wayThreeLength(matrix3, twoWay, threeWay, n);
console.log(threeWay);

console.log("Reachability matrix: \n");
let reachability = reachabilityMatrix(matrix3, n);
console.log(reachability);

let connectivity = findStrongComponents(reachability, n);
console.log("Strong connectivity matrix: \n");
console.log(connectivity);

let components = 0;
let connected;
let diff;
for (let i = 1; i <= n; i++) {
    connected = 0;
    let used = new Array(n).fill(0);
    let currentIndex = 0;
    diff = -1;
    for (let j = 0; j < n; j++) {
        if (reachability[j][j] === i) {
            used[currentIndex] = j;
            currentIndex++;
            if (j === 10) {
                components++;
            }
        }
    }
}

const condensation = calculateCondensationGraph(connectivity);
let condensationGran= condensation.filter((elem, index, self) => {
    return index === self.findIndex(t => (
        JSON.stringify(t) === JSON.stringify(elem)
    ));
});
let condensationGraph = swapArrayElements(condensationGran, 0, 1)
const nodeCoordinates = [];
const numNodes = condensationGraph.length;

for (let i = 0; i < numNodes; i++) {
    const angle = i * angleIncrement + 11;
    const x = centerX+450 + radius * Math.cos(angle);
    const y = centerY+1050 + radius * Math.sin(angle);
    nodeCoordinates.push({ x, y });
}

for (let i = 0; i < condensationGraph.length; i++) {
    const neighbors = condensationGraph[i];
    const sourceNode = nodeCoordinates[i];
    for (const neighbor of neighbors) {
        const targetNode = nodeCoordinates[neighbor];
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
    }
}

for (let i = 0; i < nodeCoordinates.length; i++) {
    const { x, y } = nodeCoordinates[i];
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#9B4AE7";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`K`+i.toString(), x, y);
}