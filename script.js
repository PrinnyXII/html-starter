// --- Funções Utilitárias ---

// Função para carregar seções (agora assíncrona e simplificada)
async function loadSection(id, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar seção ${url}: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(id).innerHTML = html;

        // Executar scripts dentro da seção carregada (se houver)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            const novoScript = document.createElement('script');
            novoScript.textContent = script.textContent;
            document.body.appendChild(novoScript); // Adiciona ao final do body
        });

    } catch (error) {
        console.error(error);
    }
}

// --- Funções Globais (que não dependem de elementos carregados dinamicamente) ---

function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
     if(janela){
         janela.style.display = (janela.style.display === 'none' || janela.style.display === '') ? 'block' : 'none';
     }
}

// --- Estado Civil ---
function abrirJanelaEstadoCivil() {
    document.getElementById("janelaEstadoCivil")?.style.display = "block"; // Usando operador '?'
}

function fecharJanelaEstadoCivil() {
    document.getElementById("janelaEstadoCivil")?.style.display = "none";
}

// --- Barra de Experiência ---
function updateExpBar(percentage) {
    const progressBar = document.getElementById('expBar');
    if (progressBar) { // Verifica se o elemento existe
        progressBar.style.width = percentage + '%';
        const textSpan = document.querySelector('.barra-texto');
        if (textSpan) {
            textSpan.textContent = '1303 - ' + percentage + '%';
        }
    }
}

// --- Características - Profissão ---
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if (detalhes) {
        detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none';
    }
}

// --- Funções auxiliares para player de música (podem ficar aqui) ---
function centralizarElementosPlayer() {
    const capaMusica = document.querySelector('.capa-musica-isaac');
    const player = document.querySelector('.player-musica-isaac');
     //Verifica se os elementos foram encontrados
    if(!capaMusica || !player){
        return;
    }
    capaMusica.style.margin = 'auto';
    player.style.display = 'flex';
    player.style.flexDirection = 'column';
    player.style.alignItems = 'center';
    player.style.justifyContent = 'space-between';
}
// Função para formatar o tempo (segundos -> minutos:segundos)
function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = Math.floor(segundos % 60);
    return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`; // Adiciona um zero se < 10
}

// --- Lista de Músicas ---
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

// --- Variáveis Globais do Player (inicializadas como null) ---
//Agora elas ficam no escopo global, mas inicializadas com null.  Só serão atribuídas DEPOIS.
let playerMusica = null;
let audio = null;
let progressBar = null;
let tempoAtual = null;
let tempoTotal = null;
let nomeMusicaIsaacElement = null;
let autorMusicaIsaacElement = null;
let capaMusicaIsaacElement = null;
let playerBackgroundElement = null;
let audioSource = null;
let musicaTocando = false;

function inicializarPlayerMusica() {
     // Seleciona os elementos *dentro* da função, depois que a seção é carregada
    playerMusica = document.querySelector('.player-musica-isaac');
    audio = document.querySelector('audio');
    progressBar = document.getElementById('progress-bar');
    tempoAtual = document.getElementById('tempo-atual');
    tempoTotal = document.getElementById('tempo-total');
    nomeMusicaIsaacElement = document.querySelector('.nome-musica-isaac');
    autorMusicaIsaacElement = document.querySelector('.autor-musica-isaac');
    capaMusicaIsaacElement = document.querySelector('.capa-musica-isaac img');
    playerBackgroundElement = document.querySelector('.player-musica-isaac');
    audioSource = document.querySelector('#audio-player source');

        //Verifica se todos os elementos foram encontrados
    if(!playerMusica || !audio || !progressBar || !tempoAtual || !tempoTotal ||
       !nomeMusicaIsaacElement || !autorMusicaIsaacElement || !capaMusicaIsaacElement ||
       !playerBackgroundElement || !audioSource){
         console.error("Erro ao inicializar o player: Elementos não encontrados");
         return;
     }
    // --- Event Listeners do Player (agora DENTRO da função de inicialização) ---
    progressBar.addEventListener('input', () => {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) {
            tempoAtual.textContent = formatarTempo(audio.currentTime);
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
            tempoTotal.textContent = formatarTempo(audio.duration);
        }
    });
}

// --- Funções do Player (agora usando os elementos selecionados acima) ---

function togglePlayerMusicaIsaac() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');
     //Verifica se os elementos foram encontrados
    if(!player || !estadoCivil){
        return;
    }

    if (player.style.display === 'none' || player.style.display === '') {
        player.style.display = 'flex';
        estadoCivil.style.zIndex = '900';
        centralizarElementosPlayer();
        selecionarMusica(1);

        progressBar.addEventListener('input', () => {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
            }
        });
    } else {
        player.style.display = 'none';
        estadoCivil.style.zIndex = '1000';
    }
}
function fecharPlayer() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');
     //Verifica se os elementos foram encontrados
    if(!player || !estadoCivil){
        return;
    }
    player.style.display = 'none';
    estadoCivil.style.zIndex = '1000';
    audio.pause();
    musicaTocando = false;
    atualizarBotaoPlay();
}
// --- Funções do Player (agora usando os elementos selecionados acima) ---

function selecionarMusica(id) {
    const musicaSelecionada = listaDeMusicas.find(musica => musica.id === id);
      //Verifica se os elementos foram encontrados
    if(!musicaSelecionada || !nomeMusicaIsaacElement || !autorMusicaIsaacElement ||
       !capaMusicaIsaacElement || !playerBackgroundElement || !audioSource){
        return;
    }

    if (musicaSelecionada) {
        nomeMusicaIsaacElement.textContent = musicaSelecionada.nome;
        autorMusicaIsaacElement.textContent = musicaSelecionada.autor;
        capaMusicaIsaacElement.src = musicaSelecionada.capa;
        playerBackgroundElement.style.backgroundImage =
            `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;
        audioSource.src = musicaSelecionada.link;
        audio.load();

        audio.oncanplaythrough = () => {
            audio.play().catch(error => console.warn("Reprodução automática bloqueada."));
            musicaTocando = true;
            atualizarBotaoPlay();
            atualizarFavoritoVisual(id);
        };
    }
}
function toggleLista() {
    const lista = document.getElementById('listaMusicas');
     //Verifica se os elementos foram encontrados
    if(!lista){
        return;
    }
    lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
    if (lista.style.display === 'block') {
        atualizarListaMusicas();
    }
}
function retroceder10s() {
      //Verifica se os elementos foram encontrados
    if(!audio?.duration){
        return;
    }
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
}

function avancar10s() {
      //Verifica se os elementos foram encontrados
    if(!audio?.duration){
        return;
    }
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }
}
function playPause() {
      //Verifica se os elementos foram encontrados
    if(!audio){
        return;
    }
    if (musicaTocando) {
        audio.pause();
        musicaTocando = false;
    } else {
        audio.play().catch(error => console.warn("Reprodução automática bloqueada."));
        musicaTocando = true;
    }
    atualizarBotaoPlay();
}
function atualizarBotaoPlay() {
    const botaoPlay = document.querySelector('.botao-controle-isaac:nth-child(2)');
      //Verifica se os elementos foram encontrados
    if(!botaoPlay){
        return;
    }
    botaoPlay.textContent = musicaTocando ? 'II' : '►';
}
// --- Favoritos (localStorage) ---
const storageKey = 'musicasFavoritadas';
let musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};

function atualizarFavoritoVisual(id) {
    const botaoFavoritar = document.querySelector('.botao-favoritar-isaac');
      //Verifica se os elementos foram encontrados
    if(!botaoFavoritar){
        return;
    }
    if (musicasFavoritadas[id]) {
        botaoFavoritar.classList.add('favoritado');
        botaoFavoritar.textContent = '💖';
    } else {
        botaoFavoritar.classList.remove('favoritado');
        botaoFavoritar.textContent = '🤍';
    }
}
function favoritarMusica() {
    const musicaAtual = listaDeMusicas.find(musica => musica.nome === nomeMusicaIsaacElement.textContent);
      //Verifica se os elementos foram encontrados
    if(!musicaAtual){
        return;
    }
    musicasFavoritadas[musicaAtual.id] = !musicasFavoritadas[musicaAtual.id];
    atualizarFavoritoVisual(musicaAtual.id);
    localStorage.setItem(storageKey, JSON.stringify(musicasFavoritadas));
}

function atualizarListaMusicas() {
    const listaContainer = document.getElementById('listaMusicas');
      //Verifica se os elementos foram encontrados
    if(!listaContainer){
        return;
    }
    listaContainer.innerHTML = '';
    listaDeMusicas.forEach(musica => {
        const item = document.createElement('p');
        item.textContent = musica.nome;
        item.addEventListener('click', () => selecionarMusica(musica.id));
        listaContainer.appendChild(item);
    });
}

// --- Função Genérica para Barras (Fama/Moral, Autoestima, etc.) ---
function atualizarBarra(idBarra, idTexto, porcentagem, idStatus = null) {
    const barra = document.getElementById(idBarra);
    const texto = document.getElementById(idTexto);
      //Verifica se os elementos foram encontrados
    if(!barra || !texto){
        return;
    }

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
          //Verifica se os elementos foram encontrados
        if(!status){
            return;
        }
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

// --- Títulos (Carrossel) ---
let carrosselInterval;
const carrossel = document.querySelector('.carrossel-imagens'); //Elemento que vai rolar
const carrosselContainer = document.querySelector('.carrossel-titulos'); //Container do carrossel

function iniciarCarrossel() { //Função separada
     //Verifica se os elementos foram encontrados
    if(!carrossel){
        return;
    }
    carrosselInterval = setInterval(() => {
        carrossel.scrollLeft += 1;
        if (carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.offsetWidth) {
            carrossel.scrollLeft = 0;
        }
    }, 30);
}
function pausarCarrossel() { //Função separada
    clearInterval(carrosselInterval);
}

// --- Funções para janelas de título (abrir, fechar, expandir) ---
function abrirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.style.display = 'block';
}

function fecharJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.style.display = 'none';
    iniciarCarrossel(); // Reinicia o carrossel
}

function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.classList.toggle('janela-expandida');
}

// --- Atributos ---
function toggleCheckbox(element) {
    element.classList.toggle("checked");
}

function atualizarAtributoAtual(atributo, total, porcentagem) {
    const valorAtual = Math.floor((porcentagem / 100) * total);
    const textoAtributo = document.getElementById(`texto-${atributo}`);
    const barraAtributo = document.getElementById(`barra-${atributo}`);
    //Verifica se os elementos foram encontrados
    if(!textoAtributo || !barraAtributo){
        return;
    }
    textoAtributo.innerText = `${valorAtual} / ${total}`;
    barraAtributo.style.width = `${porcentagem}%`;
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
    descricao:
      "Nenhuma informação sobre a chave Key of Souls está disponível.",
    item:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Souls.png?raw=true",
    efeito: "À descobrir 01.",
    icone: "https://imgur.com/zHQo8sh.png",
    detalhes: "Esta chave é um teste da alinezinha1",
  },
  {
    id: 1,
    nome: "Key of Dreams",
    descricao:
      "Nenhuma informação sobre a chave Key of Dreams está disponível.",
    item:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Dreams.png?raw=true",
    efeito: "À descobrir 02.",
    icone: "https://imgur.com/lKXdgwT.png",
    detalhes: "Esta chave é um teste da alinezinha2",
  },
  {
    id: 2,
    nome: "Key of Infinite Moon Mansion",
    descricao:
      "Nenhuma informação sobre a chave Key of Infinite Moon Mansion está disponível.",
    item:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Infinite%20Moon%20Mansion.png?raw=true",
    efeito: "À descobrir 03.",
    icone: "https://imgur.com/Hf705GX.png",
    detalhes: "Esta chave é um teste da alinezinha3",
  },
  {
    id: 3,
    nome: "Key of Desires",
    descricao:
      "Nenhuma informação sobre a chave Key of Desires está disponível.",
    item:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Desires.png?raw=true",
    efeito: "À descobrir 04.",
    icone: "https://imgur.com/L2bLSl2.png",
    detalhes: "Esta chave é um teste da alinezinha4",
  },
  {
    id: 4,
    nome: "Key of Soul World",
    descricao:
      "Nenhuma informação sobre a chave Key of Soul World está disponível.",
    item:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Soul%20World.png?raw=true",
    efeito: "À descobrir 05.",
    icone: "https://imgur.com/X1zPnlJ.png",
    detalhes: "Esta chave é um teste da alinezinha5",
  },
  {
    id: 5,
    nome: "Key of Pendragon",
    descricao:
      "Nenhuma informação sobre a chave Key of Pendragon está disponível.",
    item:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Pendragon.png?raw=true",
    efeito: "À descobrir 06.",
    icone: "assets/Recursos/Key of Pendragon.png",
    detalhes: "Esta chave é um teste da alinezinha6",
  },
  {
    id: 6,
    nome: "Key Pinnacle of Flames",
    descricao:
      "Nenhuma informação sobre a chave Key Pinnacle of Flames está disponível.",
    item:
      "https://github.com/PrinnyXII/st/blob/main/rep/Key%20Pinnacle%20of%20Flames.png?raw=true",
    efeito: "À descobrir 07.",
    icone: "https://imgur.com/46Dh8W2.png",
    detalhes: "Esta chave é um teste da alinezinha7",
  },
  {
    id: 7,
    nome: "Key of Isaac's Heart",
    descricao:
      "Nenhuma informação sobre a chave Key of Isaac's Heart está disponível.",
    item: "assets/Recursos/Key of Isaac's Heart.png",
    efeito: "À descobrir 08.",
    icone:
      "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Recursos/Key%20of%20Isaac's%20Heart.png?raw=true",
    detalhes: "Esta chave é um teste da alinezinha8",
  },
];

function navegar(id) {
    chaveAtual = id;
    const chave = chaves[chaveAtual];
 //Verifica se os elementos foram encontrados
    if(!chave || !document.getElementById("titulo-item") || !document.querySelector("#retangulo-item .descricao-detalhada") ||
      !document.querySelector(".item-imagem img") || !document.querySelector("#retangulo-efeitos .titulo-efeito") ||
      !document.querySelector("#retangulo-efeitos img") || !document.querySelector("#retangulo-efeitos .detalhes-detalhados")){
        return;
    }
    document.getElementById("titulo-item").textContent = chave.nome;
    document.querySelector("#retangulo-item .descricao-detalhada").textContent = chave.descricao;
    document.querySelector(".item-imagem img").src = chave.item;
    document.querySelector("#retangulo-efeitos .titulo-efeito").textContent = chave.efeito;
    document.querySelector("#retangulo-efeitos img").src = chave.icone;
    document.querySelector("#retangulo-efeitos .detalhes-detalhados").textContent = chave.detalhes;
    atualizarDestaqueCirculo(chaveAtual + 1);
}

function atualizarDestaqueCirculo(id) {
    document.querySelectorAll(".circulo-pequeno").forEach((circulo, index) => {
        circulo.classList.remove("active");
        if (index + 1 === id) {
            circulo.classList.add("active");
        }
    });
}

function ativarChave() {
    console.log("Função ativarChave() chamada.");
    // Implemente a lógica aqui, como:
    // - Abrir uma janela flutuante.
    // - Aplicar um efeito na página.
    // - Enviar uma requisição.
}

// --- Bençãos e Maldições ---
let posicaoCarrossel = 0;

function moverCarrossel(direcao) {
    const carrossel = document.querySelector('.carrossel-diamantes');
    const itens = carrossel.querySelectorAll('.diamante-item');
      //Verifica se os elementos foram encontrados
    if(!carrossel || !itens){
        return;
    }

    itens.forEach(item => item.classList.remove('ativo'));
    posicaoCarrossel = (posicaoCarrossel + direcao + itens.length) % itens.length;
    itens[posicaoCarrossel].classList.add('ativo');

    const tamanhoItem = itens[posicaoCarrossel].offsetWidth + 10;
    carrossel.scrollLeft = posicaoCarrossel * tamanhoItem - (carrossel.clientWidth - tamanhoItem) / 2;
}

function abrirJanela(idJanela) {
    const janela = document.getElementById(idJanela);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.style.display = 'block';
}

function fecharJanela(idJanela) {
    const janela = document.getElementById(idJanela);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.style.display = 'none';
}

function expandirJanela(idJanela) {
    const janela = document.getElementById(idJanela);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.classList.toggle('janela-expandida');
}

// --- Barra EA ---
function atualizarEA(porcentagem) {
    const barraEA = document.getElementById('preenchimento-ea');
    const textoEA = document.getElementById('texto-ea');
 //Verifica se os elementos foram encontrados
    if(!barraEA || !textoEA){
        return;
    }
    porcentagem = Math.max(0, Math.min(100, porcentagem));
    barraEA.style.width = `${porcentagem}%`;
    textoEA.textContent = `EA: ${porcentagem}%`;
}

// --- Categoria Mãe ---
function abrirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.style.display = 'block';
}

function fecharJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.style.display = 'none';
}

function expandirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`);
      //Verifica se os elementos foram encontrados
    if(!janela){
        return;
    }
    janela.classList.toggle('janela-expandida');
}

// --- Necessidades Básicas/Temporárias ---

function atualizarStatusNecessidade(grupoId, porcentagem, tipo) {
    const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
    const progressText = document.getElementById(`progresso-texto-${grupoId}`);
    const statusIndicator = document.getElementById(`estado-${grupoId}`);
      //Verifica se os elementos foram encontrados
    if(!fillBar || !progressText || !statusIndicator){
        return;
    }

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
            color = '#00B59B';
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
     // Armazenar os valores no localStorage
    localStorage.setItem(`necessidade_${grupoId}`, JSON.stringify({ porcentagem, tipo }));
}

// --- Aether ---
let porcentagemAether = 101;

function atualizarAether(porcentagem) {
    porcentagem = Math.max(0, Math.min(102, porcentagem)); // Limita entre 0 e 102
    const preenchimento = document.getElementById("preenchimentoAether");
    const texto = document.getElementById("textoAether");

    //Verificação se os elementos existem
    if(!preenchimento || !texto){
        console.error("Erro: Elementos Aether não encontrados.");
        return;
    }

    preenchimento.style.width = `${(porcentagem / 102) * 100}%`;
    texto.textContent = `Aether: ${porcentagem}%`;
     // Armazenando a porcentagem do Aether no localStorage
    localStorage.setItem('porcentagemAether', porcentagem);
}

// --- Inicialização (DOMContentLoaded) ---

// Função para adicionar event listeners a elementos que podem não existir ainda
function addEventListenerToElement(selector, event, handler) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.warn(`Elemento "${selector}" não encontrado para adicionar o event listener.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Inicializações que não dependem de seções carregadas ---
     updateExpBar(73); // Barra de Experiência
    atualizarEA(53);    // Barra EA
    inicializarPlayerMusica(); // Inicializa variáveis do player (mas *não* adiciona listeners aqui)

    // --- Carrossel de Títulos (agora *antes* de carregar as seções) ---
    // Adiciona os event listeners para o carrossel *antes* do carregamento,
    // mas *depois* de inicializar as variáveis do carrossel.
    if (carrosselContainer) { //Verifica se carrosselContainer existe
        carrosselContainer.addEventListener('mouseover', pausarCarrossel);
        carrosselContainer.addEventListener('mouseout', iniciarCarrossel);
    }
     iniciarCarrossel(); //  inicia o carrossel

    // --- Carregamento das Seções (usando a função async loadSection) ---

    loadSection("aura-buffy-content", "secoes/1-aura-buffy.html");
    loadSection("taxa-assimilacao-content", "secoes/2-taxa-de-assimilacao.html");
    loadSection("cabecalho-content", "secoes/3-cabecalho.html");
    loadSection("barra-dinheiro-content", "secoes/4-barra-dinheiro.html");
    loadSection("classes-content", "secoes/5-classes.html");
    loadSection("titulos", "secoes/7-Titulos.html"); //Carrega os titulos
    loadSection("atributos", "secoes/8-Atributos.html"); //Carrega Atributos
    loadSection("info-02", "secoes/9-Info02.html");    //Carrega Info02
    loadSection("chaves", "secoes/10-Chaves.html");   //Carrega as chaves
    loadSection("bencaos", "secoes/11-Bencoes.html"); //Carrega as bençãos
    loadSection("mae", "secoes/12-Mae.html");         //Carrega a seção mãe
    loadSection("necessidades", "secoes/13-Necessidades.html"); //Carrega as necessidades
    loadSection("aether", "secoes/14-Aether.html");       //Carrega o aether

    // --- Seção de Características (com event listeners) ---
    loadSection("caracteristicas-content", "secoes/6-caracteristicas.html").then(() => {
        // Adiciona os event listeners *depois* que a seção de características é carregada.
        // Usando a função auxiliar para evitar repetição
        addEventListenerToElement("#botaoProfissao", "click", toggleProfissao);
        addEventListenerToElement("#botaoEstadoCivil", "click", abrirJanelaEstadoCivil);
        addEventListenerToElement("#fecharEstadoCivil", "click", fecharJanelaEstadoCivil);
        addEventListenerToElement(".botao-fechar-musica-isaac", "click", fecharPlayer);
        addEventListenerToElement(".botao-favoritar-isaac", "click", favoritarMusica);
        addEventListenerToElement(".botao-menu-isaac", "click", toggleLista);

        // Inicializa as barras de autoestima e fama *aqui*, depois que a seção é carregada.
        atualizarBarra('barra-autoestima', 'texto-autoestima', 99);
        atualizarBarra('barra-fama', 'texto-fama', 94, 'status-fama');
    });

    // --- Inicialização dos Atributos (dentro do DOMContentLoaded) ---
        // Agora *dentro* do then, depois que a seção "atributos" foi carregada
        loadSection("atributos", "secoes/8-Atributos.html").then(() => {
            for (let atributo in atributos) {
                const { total, porcentagem } = atributos[atributo];
                atualizarAtributoAtual(atributo, total, porcentagem);
            }
        });

        // --- Inicialização das Chaves (dentro do DOMContentLoaded) ---
        loadSection("chaves", "secoes/10-Chaves.html").then(() => {
            // Define os estados iniciais dos círculos (quais começam ativos/inativos)
             const estadosIniciais = {
                circulo1: true,  // Ativo
                circulo2: false, // Inativo
                circulo3: true,
                circulo4: false,
                circulo5: true,
                circulo6: false,
                circulo7: true,
                circulo8: false
            };

            // Aplica os estados iniciais ao carregar a página
            for (const [id, ativo] of Object.entries(estadosIniciais)) {
                const circulo = document.getElementById(id);
                if (circulo) { //  verifica se o elemento existe
                    if (ativo) {
                        circulo.classList.add('active');
                    } else {
                        circulo.classList.remove('active');
                    }
                }
            }
             navegar(0); // Começa mostrando a primeira chave (índice 0)
        });

         // --- Inicialização das Bençãos (dentro do DOMContentLoaded) ---
        loadSection("bencaos", "secoes/11-Bencoes.html").then(() => {
            // Inicialização do Carrossel de Bençãos/Maldições (Diamante do Meio)
            const diamantes = document.querySelectorAll('.diamante-item');
            const meio = Math.floor(diamantes.length / 2);

            if(diamantes[meio]){
                diamantes[meio].classList.add('ativo');
            }
             // --- Adiciona os event listeners para as setas do carrossel de bençãos ---
            document.querySelector('.carrossel-selos .seta:first-child')?.addEventListener('click', () => moverCarrossel(-1));
            document.querySelector('.carrossel-selos .seta:last-child')?.addEventListener('click', () => moverCarrossel(1));
        });

    // --- Inicialização das Necessidades (dentro do DOMContentLoaded) ---
        loadSection("necessidades", "secoes/13-Necessidades.html").then(() => {
            //Função para necessidades
            function carregarNecessidades() {
                const grupos = [
                    'higiene', 'banheiro', 'sono', 'fome', 'sede', 'diversao',
                    'social', 'foco', 'felicidade', 'tesao', 'enjoo', 'fadiga',
                    'estresse', 'ansiedade', 'medo', 'tedio', 'raiva', 'desgaste'
                ];

                grupos.forEach(grupoId => {
                    const storedValue = localStorage.getItem(`necessidade_${grupoId}`);
                    if (storedValue) {
                        const { porcentagem, tipo } = JSON.parse(storedValue);
                        atualizarStatusNecessidade(grupoId, porcentagem, tipo);
                    } else {
                        // Valores padrão caso não haja nada no localStorage
                        let porcentagemPadrao, tipoPadrao;
                        if (['higiene', 'banheiro', 'sono', 'fome', 'sede', 'diversao', 'social', 'foco', 'felicidade', 'tesao'].includes(grupoId)) {
                            porcentagemPadrao = 100;
                            tipoPadrao = 'basica';
                        } else {
                            porcentagemPadrao = 0;
                            tipoPadrao = 'temporaria';
                        }
                        atualizarStatusNecessidade(grupoId, porcentagemPadrao, tipoPadrao);
                    }
                });
            }
             carregarNecessidades(); //Chamando a função criada
        });

    // --- Inicialização do Aether (dentro do DOMContentLoaded) ---

     loadSection("aether", "secoes/14-Aether.html").then(() => {
        // Tentando recuperar a porcentagem do Aether do localStorage
        const porcentagemAetherSalva = localStorage.getItem('porcentagemAether');

        // Se houver um valor salvo, use-o; caso contrário, use o valor padrão (101)
        if (porcentagemAetherSalva !== null) {
            porcentagemAether = parseInt(porcentagemAetherSalva, 10); // Converte para número
        }
        atualizarAether(porcentagemAether);
    });
});

// --- Movimentação manual das janelas flutuantes (Títulos, Bençãos, Filhos) ---
//  função para tornar as janelas arrastáveis (agora no escopo global)
function makeDraggable(janelaSelector) {
    document.querySelectorAll(janelaSelector).forEach(janela => {
        let isDragging = false;
        let startX, startY;

        janela.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.clientX - janela.offsetLeft;
            startY = e.clientY - janela.offsetTop;
            janela.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', e => {
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
}
//Chama a função para as janelas
makeDraggable('.janela-titulos');
makeDraggable('.janela-bencao');
makeDraggable('.janela-filhos');
makeDraggable('.janela-estado-civil');
