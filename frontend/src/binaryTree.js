//classe usada para representar um nó de arvoré binária 
class NodeTree{
    /**
     * @param {number} value
     * @param {number} posX
     * @param {number} posY
     */
    constructor(value, posX, posY) {
        this.value = value            //valor armazenado no nó 
        this.posX = posX              //posição horizontal 
        this.posY = posY              //posição vertical 

        this.leftNode = null          //filho(nó) esquerdo
        this.rightNode = null         //filho(nó) direito 
    }
}
//classe usada para gerenciar a arvoré binária e seu desenho 
class BinaryTree{
    constructor() {
        this.topNode = null     //nó rais da árvore 

        const canvas = document.getElementById("binaryCanva");
        // @ts-ignore
        const ctx = canvas.getContext("2d");  //contexto do canvas para desenho 

        this.width = 900   //largura 
        this.height = 400; //altura
        // @ts-ignore
        canvas.width = this.width;  //largura real do canvas 
        // @ts-ignore
        canvas.height = this.height; //altura real do canvas

        // @ts-ignore
        ctx.clearRect(0, 0, canvas.width, canvas.height);   //limpa o canvas 
    }

    //insere um valor na árvore binária 
    /**
     * @param {number} value
     */
    insert(value) {
        //se a árvore estiver vazia o primeiro nó vira a raiz 
        if (this.topNode == null) {
            this.topNode = new NodeTree(value, this.width / 2, 17)
        } else {
            let nodeOnTop = this.topNode     //busca a raiz

            //percorre a árvore até achar a posição correta 
            while (true) {
                //se for o valor for menor vai para a esquerda 
                if (value < nodeOnTop.value) {
                    if (nodeOnTop.leftNode == null) {
                        //cria nó à esquerda ajustando a poisção 
                        nodeOnTop.leftNode = new NodeTree(value, nodeOnTop.posX - 30, nodeOnTop.posY + 30) //'nodeOnTop.posX' desloca x para esquerda , 'nodeOnTop.posY' desce um nivél 
                        break
                    } else {
                        nodeOnTop = nodeOnTop.leftNode     //continua descendo pela esquerda 
                    }
                } else {

                    //se for maior ou igual , vai para a direita 
                    if (nodeOnTop.rightNode == null) {
                        //cria nó a direita ajuastando a posição 
                        nodeOnTop.rightNode = new NodeTree(value, nodeOnTop.posX + 30, nodeOnTop.posY + 30)  //'nodeOnTop.posX' desloca x para a direita , 'nodeOnTop.posY' desce um nivél 
                        break
                    } else {
                        nodeOnTop = nodeOnTop.rightNode   //continua descendo para a direita 
                    } 
                }
            }
        }
    }
}
//elementos da interface 
const input = document.getElementById("valueInput")
const btnInsert = document.getElementById("insertBtn")
const btnReset = document.getElementById("restartBtn")

//instância a árvore 
const tree = new BinaryTree()

//função que redesenha toda a árvore no canvas 
function drawTree() {
    const canvas = document.getElementById("binaryCanva");
    // @ts-ignore
    const ctx = canvas.getContext("2d");

    //redefine dimensões para limpar o canvas 
    // @ts-ignore
    canvas.width = 900; 
    // @ts-ignore
    canvas.height = 400;

    //limpa a área do desenho 
    // @ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //se não tiver nenhum nó , ele saí
    if (!tree.topNode) return;

    //desenha a árvore apartir da raiz 
    // @ts-ignore
    drawNode(ctx, tree.topNode);
}
//desenha um nó e suas coneções recursivamente 
function drawNode(ctx, node) {
    if (!node) return;

    //se exitir filho(nó) esquerdo , desenha linha até ele
    if (node.leftNode) {
        ctx.beginPath();
        ctx.moveTo(node.posX, node.posY);
        ctx.lineTo(node.leftNode.posX, node.leftNode.posY);
        ctx.stroke();
    }

    //se existir filho (nó) esenha linha até ele 
    if (node.rightNode) {
        ctx.beginPath();
        ctx.moveTo(node.posX, node.posY);
        ctx.lineTo(node.rightNode.posX, node.rightNode.posY);
        ctx.stroke();
    }

    //desenha o circulo do nó 
    ctx.beginPath();
    ctx.arc(node.posX, node.posY, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();

    //desenha o valor dentro do nó 
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.value, node.posX, node.posY);

    //desenha recursivamnete os outros nós (filhos)
    drawNode(ctx, node.leftNode);
    drawNode(ctx, node.rightNode);
}

//lógica quando clica para inserir valor 
function onClickInsert() {
    // @ts-ignore
    const value = Number(input.value);    //lê valor do input 
    if (isNaN(value)) return;             //ignora valores inválidos
    tree.insert(value);                   //insere na árvore
    // @ts-ignore
    input.value = "";                     //limpa input 
    drawTree();                           //redesenha tudo 
}

//está permitindo inserir valores apertando enter 
input.addEventListener('keydown', (ev) => {
    if (ev.key === "Enter")
        onClickInsert()
})

//botão inserir 
btnInsert.onclick = () => {
    onClickInsert()
}

//botão para resertar a árvore
btnReset.onclick = () => {
    tree.topNode = null;      //limpa toda a árvore
    // @ts-ignore
    const ctx = document.getElementById("binaryCanva").getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);   //limpa o canvas 
}