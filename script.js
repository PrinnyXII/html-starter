// --- Funções Utilitárias ---

// Função para carregar seções (versão com callback - CORRETA)
function loadSection(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) callback(); // Executa o callback DEPOIS de inserir o HTML
        })
        .catch(error => console.error('Erro ao carregar a seção:', error));
}
//Função universal assincrona para carregar os conteudos
async function carregarConteudo(url, idElemento) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${url}: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(idElemento).innerHTML = html;

        // Procurar por scripts dentro do HTML carregado
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            const novoScript = document.createElement('script');
            novoScript.textContent = script.textContent;
            document.body.appendChild(novoScript);
        });


    } catch (error) {
        console.error(error);
        document.getElementById(idElemento).innerHTML = `<p>Erro ao carregar conteúdo de ${url}.</p>`;
    }
}

// --- Buffy Música (Abre/Fecha Janela) ---
function toggleJanelaMusica() {
    const janela = document.getElementById('janelaMusica');
    janela.style.display = (janela.style.display === 'none' || janela.style.display === '') ? 'block' : 'none';
}

// --- Barra de Experiência ---
function updateExpBar(percentage) {
    const progressBar = document.getElementById('expBar'); // Certifique-se de que o ID está correto no HTML
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        const textSpan = document.querySelector('.barra-texto'); // Seletor correto
        if (textSpan) {
            textSpan.textContent = '1303 - ' + percentage + '%';
        }
    } else {
        console.error("Elemento 'expBar' não encontrado.");
    }
}

// --- Características - Profissão (Mostra/Esconde Detalhes) ---
function toggleProfissao() {
    const detalhes = document.getElementById('detalhesProfissao');
    if (detalhes) {
      detalhes.style.display = (detalhes.style.display === 'none' || detalhes.style.display === '') ? 'block' : 'none';
    }
}

// --- Estado Civil (Abre/Fecha Janela) ---
//MODIFICAÇÃO AQUI
function abrirJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
      if (janela) { // Verificação
        janela.style.display = "block";
    }
}

function fecharJanelaEstadoCivil() {
    const janela = document.getElementById("janelaEstadoCivil");
    if (janela) {  // Verificação
        janela.style.display = "none";
    }
}

// --- Player de Música Isaac (Refatorado) ---

// Variáveis para elementos do player (selecionados uma vez, no escopo global)
const playerMusica = document.querySelector('.player-musica-isaac'); // Elemento principal do player
const audio = document.querySelector('audio');  // Elemento <audio>
const progressBar = document.getElementById('progress-bar'); // Barra de progresso
const tempoAtual = document.getElementById('tempo-atual');   // Tempo atual (texto)
const tempoTotal = document.getElementById('tempo-total');   // Tempo total (texto)
const nomeMusicaIsaacElement = document.querySelector('.nome-musica-isaac'); // Elemento que mostra o nome da música
const autorMusicaIsaacElement = document.querySelector('.autor-musica-isaac'); // Elemento que mostra o autor
const capaMusicaIsaacElement = document.querySelector('.capa-musica-isaac img'); // Elemento <img> da capa
const playerBackgroundElement = document.querySelector('.player-musica-isaac'); // Elemento de fundo do player (para mudar a imagem)
const audioSource = document.querySelector('#audio-player source'); // Elemento <source> dentro do <audio>
let musicaTocando = false; // Variável de estado: true se a música está tocando, false se não.


// Função principal para abrir/fechar o player
function togglePlayerMusicaIsaac() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');

    if (player.style.display === 'none' || player.style.display === '') {
        player.style.display = 'flex'; // Mostra o player
        estadoCivil.style.zIndex = '900'; // Coloca a janela de estado civil atrás (se estiver aberta)
        centralizarElementosPlayer();    // Centraliza os elementos (função definida abaixo)
        selecionarMusica(1);          // Carrega a música 1 por padrão

        // ADICIONADO AQUI: O event listener para a barra de progresso
        progressBar.addEventListener('input', () => {
            if (!isNaN(audio.duration) && isFinite(audio.duration)) {
                audio.currentTime = (progressBar.value / 100) * audio.duration;
            }
        });

    } else {
        player.style.display = 'none';  // Esconde o player
        estadoCivil.style.zIndex = '1000';// Restaura o z-index da janela de estado civil
    }
}

// Função para fechar o player e parar a música
function fecharPlayer() {
    const player = document.getElementById('playerMusicaIsaac');
    const estadoCivil = document.getElementById('janelaEstadoCivil');
    if(player){
       player.style.display = 'none'; // Esconde o player
    }
    if(estadoCivil){
      estadoCivil.style.zIndex = '1000'; // Restaura o z-index
    }
    if(audio){
      audio.pause();              // Para a música
    }
    musicaTocando = false;      // Atualiza o estado
    atualizarBotaoPlay();     // Atualiza o botão play/pause
}

// Função para centralizar os elementos do player (chamada quando o player é aberto)
function centralizarElementosPlayer() {
    const capaMusica = document.querySelector('.capa-musica-isaac');
    const player = document.querySelector('.player-musica-isaac');

    capaMusica.style.margin = 'auto';  // Centraliza a capa horizontalmente
    player.style.display = 'flex';      // Garante que o player esteja visível
    player.style.flexDirection = 'column'; // Organiza os elementos verticalmente
    player.style.alignItems = 'center';    // Centraliza os itens horizontalmente
    player.style.justifyContent = 'space-between'; // Distribui o espaço verticalmente
}
// --- Lista de músicas com informações (objeto JavaScript) ---
const listaDeMusicas = [
    {
        id: 1,
        nome: "Crying Alone / Nowhere",
        autor: "Kurae Radiânthia Pendragon Isaac",
        capa: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac2.jpg?raw=true",
        background: "https://github.com/Cueinhah/Painel-de-Buffy/blob/main/assets/Imagens%20Isaac/sac1.jpg?raw=true",
        link: "assets/musicas/Crying Alone - Nowhere - Memory Breaker.mp3", //  Caminho relativo correto
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

// Função para selecionar uma música da lista (por ID)
function selecionarMusica(id) {
    const musicaSelecionada = listaDeMusicas.find((musica) => musica.id === id);

    if (musicaSelecionada) {
        // Atualiza os elementos do player com os dados da música
        nomeMusicaIsaacElement.textContent = musicaSelecionada.nome;
        autorMusicaIsaacElement.textContent = musicaSelecionada.autor;
        capaMusicaIsaacElement.src = musicaSelecionada.capa;
        playerBackgroundElement.style.backgroundImage =
            `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('${musicaSelecionada.background}')`;

        // Atualiza a fonte do áudio (usa o elemento <source>)
        audioSource.src = musicaSelecionada.link;
        audio.load(); // *Recarrega* o áudio depois de mudar o src

        // Toca a música *depois* de ter certeza que ela carregou
        audio.oncanplaythrough = () => {
            audio.play().catch(error => console.warn("Reprodução automática bloqueada pelo navegador.")); // autoplay pode ser bloqueado
            musicaTocando = true; // Define o estado como "tocando"
            atualizarBotaoPlay(); // Atualiza o botão play/pause
            atualizarFavoritoVisual(id); // Atualiza o ícone de favorito
        };
    }
    else {
        console.error("Música não encontrada!");
    }
}

// Função para abrir/fechar a lista de músicas
function toggleLista() {
    const lista = document.getElementById('listaMusicas'); //Foi corrigido para listaMusicas, pois não possui sufixo -isaac
    if(lista){ //Verifica se a lista existe
      lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
      if (lista.style.display === 'block') { //Só atualiza se for mostrada
          atualizarListaMusicas();
      }
    }
}
// Funções para controlar a reprodução
function retroceder10s() {
    // Verifica se a duração é válida *antes* de tentar modificar currentTime
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        audio.currentTime = Math.max(0, audio.currentTime - 10); // Evita valores negativos
    }
}

function avancar10s() {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); // Evita ir além da duração
    }
}
function playPause() {
    if (!audio) {
        console.error("Erro: Elemento 'audio' não encontrado!");
        return;
    }
    if (musicaTocando) {
        audio.pause();
        musicaTocando = false;
    } else {
        // Tenta tocar.  Se falhar (ex: autoplay bloqueado), mostra um aviso (opcional).
        audio.play().catch(error => console.warn("Reprodução automática bloqueada pelo navegador. O usuário precisa interagir com a página."));
        musicaTocando = true;
    }
    atualizarBotaoPlay(); // Atualiza o botão em *ambos* os casos (play e pause)
}

// Função para atualizar o texto do botão play/pause (► ou II)
function atualizarBotaoPlay() {
    const botaoPlay = document.querySelector('.botao-controle-isaac:nth-child(2)'); // Seleciona o botão correto
    if(botaoPlay){ //Verifica se o botão existe
       botaoPlay.textContent = musicaTocando ? 'II' : '►'; // Usa um caractere de pause mais consistente
    }
}
// --- Favoritar e salvar estado (localStorage) ---
const storageKey = 'musicasFavoritadas';
let musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {}; // Carrega do localStorage, ou usa um objeto vazio

// Função para atualizar a aparência do botão de favoritar (coração)
function atualizarFavoritoVisual(id) {
    const botaoFavoritar = document.querySelector('.botao-favoritar-isaac');
    if (botaoFavoritar) { //Verifica se o botão existe
        if (musicasFavoritadas[id]) {
            botaoFavoritar.classList.add('favoritado'); // Adiciona a classe CSS
            botaoFavoritar.textContent = '💖';          // Coração preenchido
        } else {
            botaoFavoritar.classList.remove('favoritado'); // Remove a classe CSS
            botaoFavoritar.textContent = '🤍';          // Coração vazio
        }
}
}

// Função para favoritar/desfavoritar uma música
function favoritarMusica() {
   const musicaAtual = listaDeMusicas.find((musica) => musica.nome === nomeMusicaIsaacElement.textContent); //Simplificado
    if(musicaAtual){
        musicasFavoritadas[musicaAtual.id] = !musicasFavoritadas[musicaAtual.id];  //Inverte o estado (true/false)
        atualizarFavoritoVisual(musicaAtual.id);  //Chama a função de atualização
        localStorage.setItem(storageKey, JSON.stringify(musicasFavoritadas)); // Salva no localStorage
    }

}

// --- Atualização da barra de progresso e tempo ---

// Atualiza a barra de progresso quando o usuário *arrasta* o controle
progressBar.addEventListener('input', () => {
     if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

// Atualiza a barra de progresso e o tempo *conforme a música toca*
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) {
        tempoAtual.textContent = formatarTempo(audio.currentTime); // Formata o tempo
        progressBar.value = (audio.currentTime / audio.duration) * 100; // Atualiza a barra
    }
});

// Atualiza o tempo total *quando a música carrega*
audio.addEventListener('loadedmetadata', () => {
    if(!isNaN(audio.duration) && isFinite(audio.duration)){
        tempoTotal.textContent = formatarTempo(audio.duration);
     }
});

// Função para formatar o tempo (segundos -> minutos:segundos)
function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const restoSegundos = Math.floor(segundos % 60);
    return `${minutos}:${restoSegundos < 10 ? '0' : ''}${restoSegundos}`; // Adiciona um zero se < 10
}

function atualizarListaMusicas() {
    const listaContainer = document.getElementById('listaMusicas');
    if(listaContainer){
        listaContainer.innerHTML = ''; // Limpa a lista antes de recriá-la

        listaDeMusicas.forEach((musica) => {
            const item = document.createElement('p');
            item.textContent = musica.nome; // Nome sincronizado
            item.addEventListener('click', () => selecionarMusica(musica.id)); // Seleciona a música ao clicar
            listaContainer.appendChild(item);
        });
    }
}
// --- Fama/Moral - Barra de Progresso e Estado (Função Refatorada) ---
//Esta é uma função genérica para atualizar as barras.  Recebe os IDs dos elementos e a porcentagem.
function atualizarBarra(idBarra, idTexto, porcentagem, idStatus = null) {
    const barra = document.getElementById(idBarra);
    const texto = document.getElementById(idTexto);

    if (barra && texto) { //Verifica se os elementos foram encontrados
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

        if (idStatus) { //Se um ID de status for fornecido
            const status = document.getElementById(idStatus);
            if(status){ //Verifica se o elemento existe
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
    }
}

// --- Títulos (Carrossel) ---
let carrosselInterval; // Variável para controlar o intervalo do carrossel (para pausar e reiniciar)
const carrossel = document.querySelector('.carrossel-imagens');
const carrosselContainer = document.querySelector('.carrossel-titulos');

function iniciarCarrossel() {
    carrosselInterval = setInterval(() => {
        carrossel.scrollLeft += 1; // Move o carrossel suavemente para a esquerda
        // Se chegou ao final, volta para o início (loop infinito)
        if (carrossel.scrollLeft >= carrossel.scrollWidth - carrossel.offsetWidth) {
            carrossel.scrollLeft = 0;
        }
    }, 30); // Intervalo de 30 milissegundos (ajuste para controlar a velocidade)
}

function pausarCarrossel() {
    clearInterval(carrosselInterval); // Para o movimento do carrossel
}

// Funções para abrir, fechar e expandir as janelas de título (usando template literals)
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
        iniciarCarrossel(); // Reinicia o carrossel ao fechar a janela
    }
}

function expandirJanelaTitulo(id) {
    const janela = document.getElementById(`janelaTitulo${id}`);
      if (janela) {
        janela.classList.toggle('janela-expandida');
    }
}

// --- Movimentação manual das janelas flutuantes (Títulos) ---
//Essa parte permite que o usuário arraste as janelas
document.querySelectorAll('.janela-titulos').forEach((janela) => {
    let isDragging = false, startX, startY;

    janela.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - janela.offsetLeft;
        startY = e.clientY - janela.offsetTop;
        janela.style.cursor = 'grabbing'; // Muda o cursor para indicar que está arrastando
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            janela.style.left = `${e.clientX - startX}px`;
            janela.style.top = `${e.clientY - startY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        janela.style.cursor = 'move'; // Restaura o cursor
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
let chaveAtual = 0; // Índice da chave ativa (começa em 0)

// Array com os dados de cada chave
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

// --- Função ativada ao clicar em "Clique para Ativar" ---
function ativarChave() {
    console.log("Função ativarChave() chamada. Implemente a lógica aqui.");
    // Adicione aqui o código que deve ser executado quando a chave for ativada.
    // Isso vai depender do que você quer que aconteça.  Pode ser, por exemplo:
    // - Abrir uma janela flutuante com mais informações.
    // - Aplicar algum efeito na página.
    // - Enviar uma requisição para um servidor.
    // - ... etc.
}

// --- Bençãos e Maldições ---
let posicaoCarrossel = 0; // Posição inicial do carrossel

function moverCarrossel(direcao) {
    const carrossel = document.querySelector('.carrossel-diamantes');
    const itens = carrossel.querySelectorAll('.diamante-item');

    itens.forEach(item => item.classList.remove('ativo')); // Remove a classe 'ativo' de todos
    posicaoCarrossel = (posicaoCarrossel + direcao + itens.length) % itens.length; // Calcula a nova posição
    itens[posicaoCarrossel].classList.add('ativo'); // Adiciona 'ativo' ao item correto

    // Faz o scroll horizontal para manter o item central visível
    const tamanhoItem = itens[posicaoCarrossel].offsetWidth + 10; // Inclui o gap (espaçamento)
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

    porcentagem = Math.max(0, Math.min(100, porcentagem)); // Garante que a porcentagem esteja entre 0 e 100
    barraEA.style.width = `${porcentagem}%`;
    textoEA.textContent = `EA: ${porcentagem}%`;
}

// --- Categoria Mãe (Funções Refatoradas)---

function abrirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`); // Usa template string e ID correto: janelaKaito, janelaTwenty
    if (janela) {
        janela.style.display = 'block';
    }
}
function fecharJanelaFilho(id) {
     const janela = document.getElementById(`janelaFilho${id}`); // Usa template string e ID correto
    if (janela) {
        janela.style.display = 'none';
    }
}

function expandirJanelaFilho(id) {
    const janela = document.getElementById(`janelaFilho${id}`); // Usa template string e ID correto
    if (janela) {
        janela.classList.toggle('janela-expandida');
    }
}

// --- Necessidades Básicas/Temporárias (Função Unificada) ---
//Juntei as duas funções para atualizar as necessidades em uma só.
function atualizarStatusNecessidade(grupoId, porcentagem, tipo) {
    const fillBar = document.getElementById(`barra-progresso-${grupoId}`);
    const progressText = document.getElementById(`progresso-texto-${grupoId}`);
    const statusIndicator = document.getElementById(`estado-${grupoId}`);

    //Verificação se os elementos existem
    if(!fillBar || !progressText || !statusIndicator) {
        console.error(`Elementos não encontrados para ${grupoId}`);
        return;  //Sai da função se algum elemento não for encontrado
    }

    fillBar.style.width = `${porcentagem}%`;
    progressText.textContent = `${porcentagem}%`;

    let color = '';
    let status = '';

    if (tipo === 'basica') {  //Lógica para necessidades básicas
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
    } else if (tipo === 'temporaria') { //Lógica para necessidades temporárias
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
     // Armazenar os valores no localStorage
    localStorage.setItem(`necessidade_${grupoId}`, JSON.stringify({ porcentagem, tipo }));
}

// --- Aether ---
let porcentagemAether = 101;//Valor inicial
function atualizarAether(porcentagem) {  //Função separada para o Aether.
    if (porcentagem > 102) porcentagem = 102; //Limite
    if (porcentagem < 0) porcentagem = 0;    //Limite

    document.getElementById("preenchimentoAether").style.width = `${(porcentagem / 102) * 100}%`; //Calcula a porcentagem
    document.getElementById("textoAether").textContent = `Aether: ${porcentagem}%`; // Mostra no texto
}

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

// --- Inicialização (DOMContentLoaded) e Carregamento de Seções ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Inicializações que *NÃO* dependem de seções carregadas ---
    //Função para as janelas
    makeDraggable('.janela-titulos');
    makeDraggable('.janela-bencao');
    makeDraggable('.janela-filhos');
    makeDraggable('.janela-estado-civil');
     updateExpBar(73); // Barra de Experiência
    atualizarEA(53);    // Barra EA

    // --- Carrossel de Títulos (agora *antes* de carregar as seções) ---
    // Adiciona os event listeners para o carrossel *antes* do carregamento,
    // mas *depois* de inicializar as variáveis do carrossel.
    if (carrosselContainer) { //Verifica se carrosselContainer existe
        carrosselContainer.addEventListener('mouseover', pausarCarrossel);
        carrosselContainer.addEventListener('mouseout', iniciarCarrossel);
    }
     iniciarCarrossel(); //  inicia o carrossel

  // --- Carregamento Assíncrono e Inicialização ---

  // Função para encapsular a lógica de inicialização após o carregamento
  function initializeAfterLoad() {
    // Lógica de inicialização que depende dos elementos carregados
     musicasFavoritadas = JSON.parse(localStorage.getItem(storageKey)) || {};
    atualizarListaMusicas();
    selecionarMusica(1);
    if (document.getElementById('listaMusicas')) {
        document.getElementById('listaMusicas').style.display = 'none';
    }
     atualizarBotaoPlay();

    //  Outras inicializações que dependem de elementos carregados podem ser adicionadas aqui
  }

  // Carrega as seções de forma assíncrona e chama a função de inicialização após cada carregamento
  carregarConteudo('secoes/1-aura-buffy.html', 'aura-buffy-content').then(initializeAfterLoad);
  carregarConteudo('secoes/2-taxa-de-assimilacao.html', 'taxa-assimilacao-content').then(initializeAfterLoad);
  carregarConteudo('secoes/3-cabecalho.html', 'cabecalho-content').then(initializeAfterLoad);
  carregarConteudo('secoes/4-barra-dinheiro.html', 'barra-dinheiro-content').then(initializeAfterLoad);
  carregarConteudo('secoes/5-classes.html', 'classes-content').then(initializeAfterLoad);
  carregarConteudo('secoes/6-caracteristicas.html', 'caracteristicas-content').then(initializeAfterLoad);
  carregarConteudo('secoes/7-Titulos.html', 'titulos-content').then(initializeAfterLoad);
  carregarConteudo('secoes/8-Atributos.html', 'atributos-content').then(initializeAfterLoad);
  carregarConteudo('secoes/9-Info02.html', 'info-02-content').then(initializeAfterLoad);
  carregarConteudo('secoes/10-Chaves.html', 'chaves-content').then(initializeAfterLoad);
  carregarConteudo('secoes/11-Bencoes.html', 'bencaos-content').then(initializeAfterLoad);
  carregarConteudo('secoes/12-Mae.html', 'mae-content').then(initializeAfterLoad);
  carregarConteudo('secoes/13-Necessidades.html', 'necessidades-content').then(initializeAfterLoad);
  carregarConteudo('secoes/14-Aether.html', 'aether-content').then(initializeAfterLoad);
});
