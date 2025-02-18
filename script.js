// --- Funções Utilitárias ---

// Função para carregar seções (mantém apenas a versão correta)
function loadSection(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Erro ao carregar a seção:', error));
}

// --- Buffy Música ---
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    janela.style.display = (janela.style.display === 'none' || janela.style.display === '') ? 'block' : 'none';
}

// --- Barra de Experiência (dentro da função de callback) ---
function updateExpBar(percentage) {
    const progressBar = document.getElementById('expBar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        const textSpan = document.querySelector('.barra-texto'); // Seleciona o elemento uma vez
        if (textSpan) {
            textSpan.textContent = '1303 - ' + percentage + '%';
        }
    } else {
        console.error("Elemento 'expBar' não encontrado.");
    }
}


// --- Classes - Texto retraído ---
function mostrarTexto() {
    const expandido = document.querySelector('.expandido'); //Não está sendo utilizado
    if (expandido) {
        expandido.style.display = expandido.style.display === 'none' ? 'block' : 'none';
    } else {
        console.error("Elemento '.expandido' não encontrado!");
    }
}

// --- Caracteristicas - Profissão ---
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none';
}

// --- Estado Civil ---
function abrirJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    janela.style.display = "block";
}

function fecharJanelaEstadoCivil() {
    document.getElementById("janelaEstadoCivil").style.display = "none";
}


// --- Player de Música Isaac ---
// Variáveis para elementos do player (selecionados uma vez)
const playerMusica = document.querySelector('.player-musica-isaac');
const audio = document.querySelector('audio');
const progressBar = document.getElementById('progress-bar');
const tempoAtual = document.getElementById('tempo-atual');
const tempoTotal = document.getElementById('tempo-total');
const nomeMusicaIsaacElement = document.querySelector('.nome-musica-isaac');
const autorMusicaIsaacElement = document.querySelector('.autor-musica-isaac');
const capaMusicaIsaacElement = document.querySelector('.capa-musica-isaac img');
const playerBackgroundElement = document.querySelector('.player-musica-isaac');
let musicaTocando = false; // Inicializa a variável


function togglePlayerMusicaIsaac() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    if (player.style.display === 'none' || player.style.display === '') {
        player.style.display = 'flex';
        estadoCivil.style.zIndex = '900';
        centralizarElementosPlayer();
        selecionarMusica(1); // Carregar a música 1 por padrão ao abrir
    } else {
        player.style.display = 'none';
        estadoCivil.style.zIndex = '1000';
    }
}

function fecharPlayer() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    player.style.display = 'none';
    estadoCivil.style.zIndex = '1000';
    audio.pause();
    musicaTocando = false;
    atualizarBotaoPlay();
}

function centralizarElementosPlayer() {
    const capaMusica = document.querySelector('.capa-musica-isaac');
    const player = document.querySelector('.player-musica-isaac');

    capaMusica.style.margin = 'auto';
    player.style.display = 'flex';
    player.style.flexDirection = 'column';
    player.style.alignItems = 'center';
    player.style.justifyContent = 'space-between';
}

// --- Lista de músicas com informações ---
const listaDeMusicas = [
    {
        id: 1,
        nome: "Crying Alone / Nowhere",
        autor: "Kurae Radiânthia Pendragon Isaac",
        capa: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true",
        background: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true",
        link: "assets/musicas/Crying Alone - Nowhere - Memory Breaker.mp3",
    },
    {
        id: 2,
        nome: "Música 2",
        autor: "Artista 2",
        capa: "https://imgur.com/ExemploCapa2.png",
        background: "https://imgur.com/ExemploBackground2.png",
        link: "assets/musicas/Musica2.mp3",
    },
    {
        id: 3,
        nome: "Música 3",
        autor: "Artista 3",
        capa: "https://imgur.com/ExemploCapa3.png",
        background: "https://imgur.com/ExemploBackground3.png",
        link: "assets/musicas/Musica3.mp3",
    },
];



// --- Funções do Player de Música ---

function selecionarMusica(id) {
    const musicaSelecionada = listaDeMusicas.find((musica) => musica.id === id);

    if (musicaSelecionada) {
        nomeMusicaIsaacElement.textContent = musicaSelecionada.nome;
        autorMusicaIsaacElement.textContent = musicaSelecionada.autor;
        capaMusicaIsaacElement.src = musicaSelecionada.capa;
        playerBackgroundElement.style.backgroundImage =
            `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;
        document.querySelector('#audio-player source').src = musicaSelecionada.link;

        audio.load();
        audio.play();
        musicaTocando = true;
        atualizarBotaoPlay();

        atualizarFavoritoVisual(id); // Atualiza favorito
    }
}


// Função para abrir/fechar a lista de músicas
function toggleLista() {
    const lista = document.getElementById('listaMusicas'); //Foi corrigido para listaMusicas, pois não possui sufixo -isaac
    lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
}

function retroceder10s() {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
}

function avancar10s() {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
}

function playPause() {
    if (musicaTocando) {
        audio.pause();
        musicaTocando = false;
    } else {
        audio.play();
        musicaTocando = true;
    }
    atualizarBotaoPlay();
}

function atualizarBotaoPlay() {
    const botaoPlay = document.querySelector('.botao-controle-isaac:nth-child(2)');
    botaoPlay.textContent = musicaTocando ? 'II' : '►';
}

// --- Favoritar e salvar estado ---
const storageKey = 'musicasFavoritadas';
let musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};

function atualizarFavoritoVisual(id) {
    const botaoFavoritar = document.querySelector('.botao-favoritar-isaac');
    if (musicasFavoritadas[id]) {
        botaoFavoritar.classList.add('favoritado');
        botaoFavoritar.textContent = '💖';
    } else {
        botaoFavoritar.classList.remove('favoritado');
        botaoFavoritar.textContent = '🤍';
    }
}

function favoritarMusica() {
    const musicaAtual = listaDeMusicas.find((musica) => musica.nome === document.querySelector('.nome-musica-isaac').textContent);
     if (musicaAtual) { //Verifica se encontrou a música
        musicasFavoritadas[musicaAtual.id] = !musicasFavoritadas[musicaAtual.id];
        atualizarFavoritoVisual(musicaAtual.id);
        localStorage.setItem(storageKey, JSON.stringify(musicasFavoritadas));
    }
}

// --- Atualiza o progresso e tempo ---
audio.addEventListener('timeupdate', () => {
    const tempo = formatarTempo(audio.currentTime);
    tempoAtual.textContent = tempo;
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});

progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = Math.floor(segundos % 60);
    return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`;
}

audio.addEventListener('loadedmetadata', () => {
    tempoTotal.textContent = formatarTempo(audio.duration);
});


function atualizarListaMusicas() {
    const listaContainer = document.getElementById('listaMusicas');
    listaContainer.innerHTML = ''; // Limpa a lista

    listaDeMusicas.forEach((musica) => {
        const item = document.createElement('p');
        item.textContent = musica.nome;
        item.addEventListener('click', () => selecionarMusica(musica.id));
        listaContainer.appendChild(item);
    });
}


// --- Fama/Moral - Barra de Progresso e Estado ---
//Função Refatorada
function atualizarBarra(idBarra, idTexto, porcentagem, idStatus = null) {
    const barra = document.getElementById(idBarra);
    const texto = document.getElementById(idTexto);

    barra.style.width = `${porcentagem}%`;
    texto.textContent = `${porcentagem}%`;

    let cor;
    if (porcentagem <= 20) {
        cor = 'darkred';
    } else if (porcentagem <= 40) {
        cor = '#FF9100';
    } else if (porcentagem <= 60) {
        cor = '#00D19A';
    } else if (porcentagem <= 80) {
        cor = '#D622EF';
    } else {
        cor = '#6222EF';
    }
    barra.style.backgroundColor = cor;

    if (idStatus) {
        const status = document.getElementById(idStatus);
        let textoStatus;

        if (porcentagem <= 20) {
            textoStatus = 'Infame - Condenado - Vilão - Corrupto';
        } else if (porcentagem <= 40) {
            textoStatus = 'Desprezado - Mal-Visto - Suspeito - Anti-Herói';
        } else if (porcentagem <= 60) {
            textoStatus = 'Ambíguo - Neutro - Indiferente - Equilibrado';
        } else if (porcentagem <= 80) {
            textoStatus = 'Respeitado - Admirado - Herói - Protetor';
        } else {
            textoStatus = 'Renomado - Lendário - Venerado - Salvador';
        }

        status.textContent = textoStatus;
    }
}



// --- Títulos - Carrossel Automático ---
let carrosselInterval;
const carrossel = document.querySelector('.carrossel-imagens');
const carrosselContainer = document.querySelector('.carrossel-titulos');

function iniciarCarrossel() {
    carrosselInterval = setInterval(() => {
        carrossel.scrollLeft += 1;
        if (carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.offsetWidth) {
            carrossel.scrollLeft = 0;
        }
    }, 30);
}

function pausarCarrossel() {
    clearInterval(carrosselInterval);
}

// Eventos para o carrossel (pausa e retoma o movimento)
carrosselContainer.addEventListener('mouseover', pausarCarrossel);
carrosselContainer.addEventListener('mouseout', iniciarCarrossel);

// Gerenciar cliques nas bolinhas do carrossel
document.querySelectorAll('.titulo-item').forEach((item) => {
    item.addEventListener('click', (e) => {
        pausarCarrossel();
        const id = e.currentTarget.getAttribute('onclick').match(/\d+/)[0];
        abrirJanelaTitulo(id);
    });
});

// --- Funções para as janelas flutuantes dos títulos ---

function abrirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      if (janela) {
        janela.style.display = 'block';
    }
}

function fecharJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      if (janela) {
        janela.style.display = 'none';
        iniciarCarrossel(); // Reinicia o carrossel
    }
}

function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      if (janela) {
        janela.classList.toggle('janela-expandida');
    }
}

// --- Movimentação manual das janelas flutuantes (Títulos) ---
document.querySelectorAll('.janela-titulos').forEach((janela) => {
    let isDragging = false, startX, startY;

    janela.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - janela.offsetLeft;
        startY = e.clientY - janela.offsetTop;
        janela.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            janela.style.left = `${e.clientX - startX}px`;
            janela.style.top = `${e.clientY - startY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        janela.style.cursor = 'move';
    });
});


// --- Atributos ---
function toggleCheckbox(element) {
    element.classList.toggle("checked");
}

function atualizarAtributoAtual(atributo, total, porcentagem) {
    const valorAtual = Math.floor((porcentagem / 100) * total);
    document.getElementById(`texto-${atributo}`).innerText = `${valorAtual} / ${total}`;
    document.getElementById(`barra-${atributo}`).style.width = `${porcentagem}%`;
}

// --- Atributos - Definindo valores e porcentagens iniciais ---
const atributos = {
    hp: { total: 4024763, porcentagem: 100 },
    mp: { total: 675157, porcentagem: 100 },
    agi: { total: 522434, porcentagem: 100 },
    def: { total: 1210293, porcentagem: 100 },
    res: { total: 303776, porcentagem: 100 },
    spd: { total: 836877, porcentagem: 100 },
    int: { total: 353947, porcentagem: 100 },
    atk: { total: 1701508, porcentagem: 100 },
    smp: { total: 9314172, porcentagem: 73.72381 },
    unknown: { total: 100, porcentagem: 47.19 }
};


// --- Selos/Chaves ---
let chaveAtual = 0;

const chaves = [
    {
        id: 0,
        nome: "Key of Souls",
        descricao: "Nenhuma informação sobre a chave Key of Souls está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true",
        efeito: "À descobrir 01.",
        icone: "https://imgur.com/zHQo8sh.png",
        detalhes: "Esta chave é um teste da alinezinha1"
    },
    {
        id: 1,
        nome: "Key of Dreams",
        descricao: "Nenhuma informação sobre a chave Key of Dreams está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true",
        efeito: "À descobrir 02.",
        icone: "https://imgur.com/lKXdgwT.png",
        detalhes: "Esta chave é um teste da alinezinha2"
    },
    {
        id: 2,
        nome: "Key of Infinite Moon Mansion",
        descricao: "Nenhuma informação sobre a chave Key of Infinite Moon Mansion está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true",
        efeito: "À descobrir 03.",
        icone: "https://imgur.com/Hf705GX.png",
        detalhes: "Esta chave é um teste da alinezinha3"
    },
    {
        id: 3,
        nome: "Key of Desires",
        descricao: "Nenhuma informação sobre a chave Key of Desires está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true",
        efeito: "À descobrir 04.",
        icone: "https://imgur.com/L2bLSl2.png",
        detalhes: "Esta chave é um teste da alinezinha4"
    },
    {
        id: 4,
        nome: "Key of Soul World",
        descricao: "Nenhuma informação sobre a chave Key of Soul World está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true",
        efeito: "À descobrir 05.",
        icone: "https://imgur.com/X1zPnlJ.png",
        detalhes: "Esta chave é um teste da alinezinha5"
    },
    {
        id: 5,
        nome: "Key of Pendragon",
        descricao: "Nenhuma informação sobre a chave Key of Pendragon está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true",
        efeito: "À descobrir 06.",
        icone: "assets/Recursos/Key of Pendragon.png",
        detalhes: "Esta chave é um teste da alinezinha6"
    },
    {
        id: 6,
        nome: "Key Pinnacle of Flames",
        descricao: "Nenhuma informação sobre a chave Key Pinnacle of Flames está disponível.",
        item: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20Pinnacle%20of%20Flames.png?raw=true",
        efeito: "À descobrir 07.",
        icone: "https://imgur.com/46Dh8W2.png",
        detalhes: "Esta chave é um teste da alinezinha7"
    },
    {
        id: 7,
        nome: "Key of Isaac's Heart",
        descricao: "Nenhuma informação sobre a chave Key of Isaac's Heart está disponível.",
        item: "assets/Recursos/Key of Isaac's Heart.png",
        efeito: "À descobrir 08.",
        icone: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true",
        detalhes: "Esta chave é um teste da alinezinha8"
    },
];

// Função para navegar entre as chaves (agora recebe o ID diretamente)
function navegar(id) {
    chaveAtual = id;
    const chave = chaves[chaveAtual];

    // Atualiza Retângulo Item
    document.getElementById("titulo-item").textContent = chave.nome;
    document.querySelector("#retangulo-item .descricao-detalhada").textContent = chave.descricao;

    // Atualiza a imagem no Item-Imagem
    document.querySelector(".item-imagem img").src = chave.item;

    // Atualiza Retângulo Efeitos
    document.querySelector("#retangulo-efeitos .titulo-efeito").textContent = chave.efeito;
    document.querySelector("#retangulo-efeitos img").src = chave.icone;
    document.querySelector("#retangulo-efeitos .detalhes-detalhados").textContent = chave.detalhes;

    // Atualiza Destaque dos Círculos
    atualizarDestaqueCirculo(chaveAtual + 1);
}

function atualizarDestaqueCirculo(id) {
    document.querySelectorAll(".circulo-pequeno").forEach((circulo, index) => {
        circulo.classList.remove("active"); // Remove a classe de todos
        if (index + 1 === id) {
            circulo.classList.add("active"); // Adiciona apenas ao correto
        }
    });
}

function ativarChave() {
    console.log("Função ativarChave() chamada. Implemente a lógica aqui.");
    // Adicione aqui o código que deve ser executado quando a chave for ativada.
}

// --- Bençãos e Maldições ---
let posicaoCarrossel = 0;

function moverCarrossel(direcao) {
    const carrossel = document.querySelector('.carrossel-diamantes');
    const itens = carrossel.querySelectorAll('.diamante-item');

    itens.forEach(item => item.classList.remove('ativo'));
    posicaoCarrossel = (posicaoCarrossel + direcao + itens.length) % itens.length;
    itens[posicaoCarrossel].classList.add('ativo');

    const tamanhoItem = itens[posicaoCarrossel].offsetWidth + 10;
    carrossel.scrollLeft = posicaoCarrossel * tamanhoItem - (carrossel.clientWidth - tamanhoItem) / 2;
}


function abrirJanela(idJanela) {
     const janela = document.getElementById(idJanela);
        if(janela){
            janela.style.display = 'block';
        }
}


function fecharJanela(idJanela) {
   const janela = document.getElementById(idJanela);
        if(janela){
            janela.style.display = 'none';
        }
}


function expandirJanela(idJanela) {
    const janela = document.getElementById(idJanela);
        if(janela){
            janela.classList.toggle('janela-expandida');
        }
}

// --- Tornar a Janela Arrastável (Bençãos/Maldições) ---
document.querySelectorAll('.janela-bencao').forEach((janela) => {
    let isDragging = false, startX, startY;

    janela.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - janela.offsetLeft;
        startY = e.clientY - janela.offsetTop;
        janela.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            janela.style.left = `${e.clientX - startX}px`;
            janela.style.top = `${e.clientY - startY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        janela.style.cursor = 'move';
    });
});

// --- Barra EA ---
function atualizarEA(porcentagem) {
    const barraEA = document.getElementById('preenchimento-ea');
    const textoEA = document.getElementById('texto-ea');

    porcentagem = Math.max(0, Math.min(100, porcentagem));
    barraEA.style.width = `${porcentagem}%`;
    textoEA.textContent = `EA: ${porcentagem}%`;
}


// --- Categoria Mãe ---
//Funções Refatoradas
function abrirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`); // Usar ID
    if (janela) {
        janela.style.display = 'block';
    }
}
function fecharJanelaFilho(id) {
     const janela = document.getElementById(`janelaFilho${id}`); // Usar ID
    if (janela) {
        janela.style.display = 'none';
    }
}

function expandirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`); // Usar ID
    if (janela) {
        janela.classList.toggle('janela-expandida');
    }
}


// --- Necessidades Básicas/Temporárias (Função Unificada) ---
function atualizarStatusNecessidade(grupoId, porcentagem, tipo) {
    const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
    const progressText = document.getElementById(`progresso-texto-${grupoId}`);
    const statusIndicator = document.getElementById(`estado-${grupoId}`);

    fillBar.style.width = `${porcentagem}%`;
    progressText.textContent = `${porcentagem}%`;

    let color = '';
    let status = '';

    if (tipo === 'basica') {
        if (porcentagem <= 0) {
            color = '#00B59B';
            status = 'Nulo';
        } else if (porcentagem <= 5) {
            color = 'darkred';
            status = 'Crítico';
        } else if (porcentagem <= 30) {
            color = 'red';
            status = 'Baixo';
        } else if (porcentagem <= 60) {
            color = '#FFAA00';
            status = 'Moderado';
        } else if (porcentagem <= 95) {
            color = 'green';
            status = 'Bom';
        } else {
            color = '#00B59B';
            status = 'Excelente';
        }
    } else if (tipo === 'temporaria') {
        if (porcentagem <= 0) {
            color = '#00B59B';
            status = 'Nulo';
        } else if (porcentagem <= 5) {
            color = '#00B59B'; // Mesma cor para "Muito Baixo"
            status = 'Muito Baixo';
        } else if (porcentagem <= 30) {
            color = 'green';
            status = 'Baixo';
        } else if (porcentagem <= 60) {
            color = '#FFAA00';
            status = 'Moderado';
        } else if (porcentagem <= 95) {
            color = 'red';
            status = 'Alto';
        } else {
            color = 'darkred';
            status = 'Crítico';
        }
    }

    fillBar.style.backgroundColor = color;
    statusIndicator.textContent = status;
}

// --- Aether ---
let porcentagemAether = 101;//Valor inicial
function atualizarAether(porcentagem) {
    if (porcentagem > 102) porcentagem = 102;
    if (porcentagem < 0) porcentagem = 0;

    document.getElementById("preenchimentoAether").style.width = `${(porcentagem / 102) * 100}%`;
    document.getElementById("textoAether").textContent = `Aether: ${porcentagem}%`; // Usar IDs
}


// --- Inicialização (DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Música Isaac ---
    musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};
    atualizarListaMusicas();
    selecionarMusica(1);
    document.getElementById('listaMusicas').style.display = 'none'; // Esconde lista
    atualizarBotaoPlay();

    // --- Barra de Experiência ---
    updateExpBar(73);

    // --- Autoestima e Fama/Moral ---
    atualizarBarra('barra-autoestima', 'texto-autoestima', 99);
    atualizarBarra('barra-fama', 'texto-fama', 94, 'status-fama');

   // --- Títulos - Inicia o carrossel ---
    iniciarCarrossel();

    // --- Atributos ---
      for (let atributo in atributos) {
        const { total, porcentagem } = atributos[atributo];
        atualizarAtributoAtual(atributo, total, porcentagem);
    }

    // --- Selos/Chaves ---
    // Estado inicial dos círculos (agora usando classList.add)
      const estadosIniciais = {
        circulo1: true,
        circulo2: false,
        circulo3: true,
        circulo4: false,
        circulo5: true,
        circulo6: false,
        circulo7: true,
        circulo8: false
    };

    for (const [id, ativo] of Object.entries(estadosIniciais)) {
        const circulo = document.getElementById(id);
        if (ativo) {
            circulo.classList.add('active');
        }
    }

     navegar(0); // Começa mostrando a primeira chave

    // --- Bençãos/Maldições (Diamante do Meio) ---
    const diamantes = document.querySelectorAll('.diamante-item');
    const meio = Math.floor(diamantes.length / 2);
    if (diamantes[meio]) {
        diamantes[meio].classList.add('ativo');
    }

    // --- Barra EA ---
    atualizarEA(53);


    // --- Necessidades ---
    atualizarStatusNecessidade('grupo-higiene', 100, 'basica');
    atualizarStatusNecessidade('grupo-banheiro', 100, 'basica');
    atualizarStatusNecessidade('grupo-sono', 100, 'basica');
    atualizarStatusNecessidade('grupo-fome', 99, 'basica');
    atualizarStatusNecessidade('grupo-sede', 99, 'basica');
    atualizarStatusNecessidade('grupo-diversao', 99, 'basica');
    atualizarStatusNecessidade('grupo-social', 99, 'basica');
    atualizarStatusNecessidade('grupo-foco', 99, 'basica');
    atualizarStatusNecessidade('grupo-felicidade', 99, 'basica');
    atualizarStatusNecessidade('grupo-tesao', 99, 'basica');
    atualizarStatusNecessidade('grupo-enjoo', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-fadiga', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-estresse', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-ansiedade', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-medo', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-tedio', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-raiva', 0, 'temporaria');
    atualizarStatusNecessidade('grupo-desgaste', 0, 'temporaria');

    // --- Aether ---
    atualizarAether(porcentagemAether);
});

// --- Carregamento de Seções (usando a versão correta de loadSection) ---
loadSection("secao-aura", "Seções/1-Aura-Buffy.html", function() {
    const playerMusica = document.querySelector("#janelaMusica iframe");
    if (playerMusica) {
        playerMusica.src = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1961843283%3Fsecret_token%3Ds-lg9054r5PuH";
    } else {
        console.error("O elemento #janelaMusica iframe não foi encontrado.");
    }
});
loadSection("secao-assimilacao", "Seções/2-Taxa-de-Assimilação.html");
loadSection("se
