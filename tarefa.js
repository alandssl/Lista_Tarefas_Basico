const input_tarefa = document.querySelector('.input-tarefa');
const tarefa = document.querySelector('.tarefas');
const button = document.querySelector('.btn-tarefa');

function criarLi(){
    const li = document.createElement('li');
    return li;
}

function criarApagar(){
    const apagar = document.createElement('button');
    apagar.setAttribute('class', 'apagar')
    apagar.innerText = 'Apagar';
    return apagar;
}

function apaga(elemento){
    elemento.parentElement.remove();
}

function renderTask(task){
    const li = criarLi();
    li.innerText = task.texto || task.text || '';
    li.setAttribute('data-id', task.id || task.ID || '');
    const apagaBtn = criarApagar();
    li.appendChild(apagaBtn);
    tarefa.appendChild(li);
}

async function fetchTasks(){
    try{
        const res = await fetch('/api/tarefas');
        if(!res.ok) throw new Error('Erro na resposta da rede');
        const list = await res.json();
        tarefa.innerHTML = '';
        list.forEach(renderTask);
    }catch(err){
        console.error('Falha ao buscar tarefas:', err);
    }
}

button.addEventListener('click', async function(){
    const texto = input_tarefa.value.trim();
    if(!texto) return;
    try{
        const res = await fetch('/api/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: texto })
        });
        if(!res.ok) throw new Error('Falha ao criar tarefa');
        const created = await res.json();
        renderTask(created);
        input_tarefa.value = '';
        input_tarefa.focus();
    }catch(err){
        console.error('Falha ao adicionar tarefa:', err);
    }
});

document.addEventListener('click', async function(e){
    const element = e.target;
    if(element.classList.contains('apagar')){
        const li = element.parentElement;
        const id = li.getAttribute('data-id');
        try{
            const res = await fetch('/api/tarefas/' + id, { method: 'DELETE' });
            if(res.ok){
                apaga(element);
            } else {
                console.error('Falha ao deletar tarefa');
            }
        }catch(err){
            console.error('Falha ao deletar tarefa', err);
        }
    }
});

// initial load
fetchTasks();