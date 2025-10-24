const input_tarefa = document.querySelector('.input-tarefa');
const tarefa = document.querySelector('.tarefas');
const button = document.querySelector('.btn-tarefa');


function criarLi(){
    const li = document.createElement('li');
    return li;
};

function criarApagar(){
    const apagar = document.createElement('button');
    apagar.setAttribute('class', 'apagar')
    apagar.innerText = 'Apagar';
    return apagar;
};

function apaga(elemento){
    elemento.parentElement.remove();
};

function criarTarefa(texto){
    let li = criarLi();
    li.innerText = texto;
    tarefa.appendChild(li);
    input_tarefa.value = '';
    input_tarefa.focus();
    const apaga = criarApagar();
    li.appendChild(apaga);
    salvarTarefas()
};


button.addEventListener('click', function(){
    if (!input_tarefa.value) return;
    criarTarefa(input_tarefa.value);
});

document.addEventListener('click', function(e){
    const element = e.target;
    if(element.classList.contains('apagar')){
        apaga(element);
        salvarTarefas();
    };
});

function salvarTarefas(){
    const liTarefas = tarefa.querySelectorAll('li');
    const listaDeTarefas = [];

    liTarefas.forEach(li => {
        let texto = li.innerText.replace('Apagar', '').trim(); 
        listaDeTarefas.push(texto);
    });

    localStorage.setItem('tarefas', JSON.stringify(listaDeTarefas));
}

function adicionarTarefasSalvas(){
    const tarefas = localStorage.getItem('tarefas');
    const lista = JSON.parse(tarefas);

    if(!lista) return;

    lista.forEach(texto => {
        criarTarefa(texto);
    });
}


adicionarTarefasSalvas()