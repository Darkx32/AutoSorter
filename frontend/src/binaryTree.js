class NodeTree{
    /**
     * @param {number} value
     * @param {number} posX
     * @param {number} posY
     */
    constructor(value, posX, posY) {
        this.value = value
        this.posX = posX
        this.posY = posY

        this.leftNode = null
        this.rightNode = null
    }
}

class BinaryTree{
    constructor() {
        this.topNode = null

        const canvas = document.getElementById("binaryCanva");
        // @ts-ignore
        const ctx = canvas.getContext("2d");

        this.width = 900
        this.height = 400;
        // @ts-ignore
        canvas.width = this.width;
        // @ts-ignore
        canvas.height = this.height;

        // @ts-ignore
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * @param {number} value
     */
    insert(value) {
        if (this.topNode == null) {
            this.topNode = new NodeTree(value, this.width / 2, 17)
        } else {
            let nodeOnTop = this.topNode
            while (true) {
                if (value < nodeOnTop.value) {
                    if (nodeOnTop.leftNode == null) {
                        nodeOnTop.leftNode = new NodeTree(value, nodeOnTop.posX - 30, nodeOnTop.posY + 30)
                        break
                    } else {
                        nodeOnTop = nodeOnTop.leftNode
                    }
                } else {
                    if (nodeOnTop.rightNode == null) {
                        nodeOnTop.rightNode = new NodeTree(value, nodeOnTop.posX + 30, nodeOnTop.posY + 30)
                        break
                    } else {
                        nodeOnTop = nodeOnTop.rightNode
                    }
                }
            }
        }
    }
}

const input = document.getElementById("valueInput")
const btnInsert = document.getElementById("insertBtn")
const btnReset = document.getElementById("restartBtn")

const tree = new BinaryTree()

function drawTree() {
    const canvas = document.getElementById("binaryCanva");
    // @ts-ignore
    const ctx = canvas.getContext("2d");

    // @ts-ignore
    canvas.width = 900;
    // @ts-ignore
    canvas.height = 400;

    // @ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!tree.topNode) return;

    // @ts-ignore
    drawNode(ctx, tree.topNode);
}

function drawNode(ctx, node) {
    if (!node) return;

    if (node.leftNode) {
        ctx.beginPath();
        ctx.moveTo(node.posX, node.posY);
        ctx.lineTo(node.leftNode.posX, node.leftNode.posY);
        ctx.stroke();
    }

    if (node.rightNode) {
        ctx.beginPath();
        ctx.moveTo(node.posX, node.posY);
        ctx.lineTo(node.rightNode.posX, node.rightNode.posY);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(node.posX, node.posY, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.value, node.posX, node.posY);

    drawNode(ctx, node.leftNode);
    drawNode(ctx, node.rightNode);
}

function onClickInsert() {
    // @ts-ignore
    const value = Number(input.value);
    if (isNaN(value)) return;
    tree.insert(value);
    // @ts-ignore
    input.value = "";
    drawTree();
}

input.addEventListener('keydown', (ev) => {
    if (ev.key === "Enter")
        onClickInsert()
})

btnInsert.onclick = () => {
    onClickInsert()
}

btnReset.onclick = () => {
    tree.topNode = null;
    // @ts-ignore
    const ctx = document.getElementById("binaryCanva").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}