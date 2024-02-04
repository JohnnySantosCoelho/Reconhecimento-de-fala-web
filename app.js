const caixaTexto = document.getElementById('texto-transcrito');
const botaoIniciar = document.getElementById('transcrever');
const botaoParar = document.getElementById('parar');
const botaoPausar = document.getElementById('pausar');
const minutosElemento = document.getElementById('minutos');
const segundosElemento = document.getElementById('segundos');
const barraProgresso = document.getElementById('progresso');
let reconhecimento;
let temporizador;
let duracaoTotal = 120;
let segundos = 0;
let reconhecimentoPausado = false;

function iniciarReconhecimento() {
    console.log('Iniciando reconhecimento...');
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        try {
            reconhecimento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        } catch (error) {
            console.error('Erro ao criar o objeto SpeechRecognition:', error.message);
            exibirErro('Erro ao iniciar o reconhecimento de voz. Verifique se o navegador oferece suporte.');
            return;
        }

        reconhecimento.lang = 'pt-BR';

        reconhecimento.onresult = (evento) => {
            const transcricao = evento.results[0][0].transcript;
            caixaTexto.value = transcricao;
        };

        reconhecimento.onend = () => {
            console.log('Reconhecimento concluído.');
            reiniciarReconhecimento();
        };

        if (!reconhecimentoPausado) {
            reconhecimento.start();
            iniciarTemporizador();
        } else {
            reconhecimentoPausado = false;
        }
    } else {
        exibirErro('Seu navegador não oferece suporte ao reconhecimento de voz. Experimente usar o Google Chrome.');
    }
}

function pararReconhecimento() {
    console.log('Parando reconhecimento...');
    if (reconhecimento) {
        reconhecimento.stop();
        limparTemporizador();
    } else {
        console.error('Erro: Reconhecimento não está definido.');
        exibirErro('Erro ao parar o reconhecimento. O reconhecimento não está definido.');
    }
}

function pausarReconhecimento() {
    console.log('Pausando reconhecimento...');
    if (reconhecimento) {
        reconhecimento.onend = null;
        reconhecimento.abort();
        limparTemporizador();
        reconhecimentoPausado = true;
    } else {
        console.error('Erro: Reconhecimento não está definido.');
        exibirErro('Erro ao pausar o reconhecimento. O reconhecimento não está definido.');
    }
}

function reiniciarReconhecimento() {
    console.log('Reiniciando reconhecimento...');
    if (!reconhecimentoPausado) {
        iniciarReconhecimento();
    }
}

function iniciarTemporizador() {
    console.log('Iniciando temporizador...');
    limparTemporizador(); // Limpa o temporizador existente, se houver
    temporizador = setInterval(() => {
        const porcentagemConcluida = (segundos / duracaoTotal) * 100;
        barraProgresso.style.width = porcentagemConcluida + '%';
        atualizarTemporizador();

        if (segundos >= duracaoTotal) {
            pararReconhecimento(); // Parar após atingir a duração total
            reiniciarReconhecimento(); // Reiniciar após parar
        } else {
            segundos++;
        }
    }, 1000);
}

function atualizarTemporizador() {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    minutosElemento.textContent = minutos;
    segundosElemento.textContent = segundosRestantes;
}

function limparTemporizador() {
    console.log('Limpando temporizador...');
    clearInterval(temporizador);
    segundos = 0;
    minutosElemento.textContent = '0';
    segundosElemento.textContent = '0';
    barraProgresso.style.width = '0%';
}

function exibirErro(mensagem) {
    alert(`Erro: ${mensagem}`);
}

botaoIniciar.addEventListener('click', () => {
    iniciarReconhecimento();
});

botaoParar.addEventListener('click', () => {
    pararReconhecimento();
});

botaoPausar.addEventListener('click', () => {
    pausarReconhecimento();
});
