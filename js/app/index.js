function hexToRgb(corHex){

    const r = parseInt(corHex.substr(1,2), 16);
    const g = parseInt(corHex.substr(3,2), 16);
    const b = parseInt(corHex.substr(5,2), 16);

    return [r,g,b];

}

function stringRgbToRgb(strRgb, callback = ()=>{}){

    let arrayRgb = strRgb.match(/\d+/g);
    let [r,g,b] = arrayRgb.map((num)=>{return parseInt(num)})

    return callback(r,g,b);

}

function rgbToHex(r,g,b){

    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}

function trocarCorDetalhes(r,g,b){

    let corDetalhes = "white";

    let range = 190;

    console.log(r > range)

    if (r > range && g > range && b > range){

        console.log(r,g,b)

        corDetalhes = "black";

    }

    document.documentElement.style.setProperty("--corDetalhes", corDetalhes);

}

function trocarCorTema(corHex){

    let [r,g,b] = hexToRgb(corHex);

    document.documentElement.style.setProperty("--corTema", corHex);

    trocarCorDetalhes(r,g,b);

}

function carregarCorTema(){

    const root = document.documentElement;
    const inputTrocarCor = document.querySelector("input#trocarCor");

    let corTema = getComputedStyle(root).getPropertyValue("--corTema");
    let corDetalhes = getComputedStyle(root).getPropertyValue("--corDetalhes");

    if (localStorage.corApp) {
        
        let corApp = JSON.parse(localStorage.corApp);

        corTema = corApp.tema;
        corDetalhes = corApp.detalhes;
        
    };

    root.style.setProperty("--corTema", corTema);
    root.style.setProperty("--corDetalhes", corDetalhes);
    stringRgbToRgb(corTema,function(r,g,b){

        inputTrocarCor.value = rgbToHex(r,g,b)

    });

}

function salvarCorTema(){

    const divMain = document.querySelector("div#main");
    const root = document.documentElement;

    const corApp = {

        tema: getComputedStyle(divMain).getPropertyValue("background-color"),
        detalhes: root.style.getPropertyValue("--corDetalhes")

    }

    localStorage.corApp = JSON.stringify(corApp)
        
}

function checarTarefasPendentesEConcluídas(){

    let nodeListCheckboxTodo = document.querySelectorAll("input.checkboxTodo");
    let tarefasTotais = nodeListCheckboxTodo.length;
    let arrayCheckboxTodo = Array.from(nodeListCheckboxTodo);

    let tarefasConcluidas = arrayCheckboxTodo.filter((cbt)=>cbt.checked).length;
    let tarefasPendentes = tarefasTotais - tarefasConcluidas;

    return `${tarefasPendentes}/${tarefasConcluidas}`;

}

function atualizarContador(){

    contadorTarPendConc.innerHTML = `Pendentes/concluídas: ${checarTarefasPendentesEConcluídas()}`

}

function salvarTarefas(){

    let arrayLiTodo = document.querySelectorAll("li.todo"); arrayLiTodo = Array.from(arrayLiTodo);

    tarefas = arrayLiTodo.map((todo)=>{

        return a = {texto: todo.children[1].innerText, concluida: todo.children[0].checked}
    
    })

    if (localStorage.tarefas){

        localStorage.removeItem("tarefas");

    }

    localStorage.setItem("tarefas",JSON.stringify(tarefas));

}

function carregarTarefas(){

    if (localStorage.tarefas){

        let tarefas = JSON.parse(localStorage.tarefas);

        tarefas.forEach((tarefa)=>{

            criarTarefa(tarefa.texto, tarefa.concluida);

        })

    }

}

function criarTarefa(novaTarefa, checked = false){

    numTarefas++;

    let li = document.createElement("li"); 
    li.className = "todo";
    
    let input = document.createElement("input");
    input.id = `todo${numTarefas}`; input.className = "checkboxTodo"; input.type = "checkbox";

    input.checked = checked;

    let label = document.createElement("label");
    label.htmlFor = input.id; label.innerText = novaTarefa; label.className = "tarefa";

    let span = document.createElement("span");
    span.innerHTML = "&#x2716"; span.className = "excluir";

    input.onclick = atualizarContador;

    span.onclick = (e)=>{

        e.target.parentNode.remove(); 

    }

    ulTodoList.append(li); li.append(input); li.append(label); li.append(span);

}

function configurarNovaTarefa(novaTarefa){

    if (novaTarefa){

        criarTarefa(novaTarefa);

        inputNovaTarefa.value = "";
        inputNovaTarefa.focus();

        ulTodoList.parentElement.scrollTo(0,ulTodoList.parentElement.scrollHeight);

    }


}

function atualizarAlturaViewport(){

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

}

window.onbeforeunload = ()=>{

    salvarCorTema();
    salvarTarefas();

};
const buttonAddNovaTarefa = document.querySelector("button#addNovaTarefa");
const inputNovaTarefa = document.querySelector("input#novaTarefa");
const ulTodoList = document.querySelector("ul#todoList");
const contadorTarPendConc = document.querySelector("span#contadorTarPendConc");

let numTarefas = 0;

buttonAddNovaTarefa.onclick = ()=>{configurarNovaTarefa(inputNovaTarefa.value)};
document.addEventListener("keypress", (event)=>{

    if (event.key=="Enter"){
        configurarNovaTarefa(inputNovaTarefa.value)
    }

})

window.onresize = atualizarAlturaViewport;

const config = {attributes: true, childList: true};
const callback = atualizarContador;
const observer = new MutationObserver(callback);
observer.observe(ulTodoList, config);

carregarCorTema();
carregarTarefas();
atualizarAlturaViewport();