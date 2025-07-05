// Função para formatar data no formato DD.MM.AAAA
function formatarData(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString + 'T00:00:00');
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}.${mes}.${ano}`;
}

// Função para atualizar o resultado
function atualizarResultado() {
    const empresa = document.getElementById('empresa').value.trim().toUpperCase();
    const tipoDoc = document.getElementById('tipoDoc').value;
    const dataEmissao = document.getElementById('dataEmissao').value;
    const dataVencimento = document.getElementById('dataVencimento').value;
    const vencimentoTipo = document.querySelector('input[name="vencimentoTipo"]:checked').value;
    let resultado = '';
    if (empresa && tipoDoc && dataEmissao) {
        const dataEmissaoFormatada = formatarData(dataEmissao);
        let vencimentoFormatado = '';
        if (vencimentoTipo === 'indeterminado') {
            vencimentoFormatado = 'INDETERMINADO';
        } else if (dataVencimento) {
            vencimentoFormatado = formatarData(dataVencimento);
        }
        if (vencimentoFormatado) {
            resultado = `${empresa}_${tipoDoc}_EMISSAO ${dataEmissaoFormatada}_VENCIMENTO ${vencimentoFormatado}`;
        } else {
            resultado = 'Preencha todos os campos obrigatórios';
        }
    } else {
        resultado = 'Preencha todos os campos obrigatórios';
    }
    document.getElementById('resultado').textContent = resultado;
}

// Função para copiar texto
async function copiarTexto() {
    const texto = document.getElementById('resultado').textContent;
    if (texto === 'Preencha todos os campos obrigatórios' ||
        texto === 'Preencha os campos acima para gerar o nome do arquivo') {
        alert('Preencha todos os campos antes de copiar!');
        return;
    }
    try {
        await navigator.clipboard.writeText(texto);
        mostrarMensagemSucesso();
    } catch (err) {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        mostrarMensagemSucesso();
    }
}

// Função para mostrar mensagem de sucesso
function mostrarMensagemSucesso() {
    const mensagem = document.getElementById('mensagemSucesso');
    mensagem.style.display = 'block';
    setTimeout(() => {
        mensagem.style.display = 'none';
    }, 3000);
}

// Função para limpar campos
function limparCampos() {
    document.getElementById('empresa').value = '';
    document.getElementById('tipoDoc').value = '';
    document.getElementById('dataEmissao').value = '';
    document.getElementById('dataVencimento').value = '';
    document.querySelector('input[name="vencimentoTipo"][value="data"]').checked = true;
    document.getElementById('dataVencimento').style.display = 'block';
    document.getElementById('resultado').textContent = 'Preencha os campos acima para gerar o nome do arquivo';
}

// Função para controlar a visibilidade do campo de data de vencimento
function controlarVencimento() {
    const vencimentoTipo = document.querySelector('input[name="vencimentoTipo"]:checked').value;
    const campoData = document.getElementById('dataVencimento');
    if (vencimentoTipo === 'indeterminado') {
        campoData.style.display = 'none';
        campoData.value = '';
    } else {
        campoData.style.display = 'block';
    }
    atualizarResultado();
}

// Event listeners
document.getElementById('empresa').addEventListener('input', atualizarResultado);
document.getElementById('tipoDoc').addEventListener('change', atualizarResultado);
document.getElementById('dataEmissao').addEventListener('change', atualizarResultado);
document.getElementById('dataVencimento').addEventListener('change', atualizarResultado);

// Event listeners para os radio buttons
document.querySelectorAll('input[name="vencimentoTipo"]').forEach(radio => {
    radio.addEventListener('change', controlarVencimento);
});

// Configurar data de hoje como padrão para emissão
document.getElementById('dataEmissao').valueAsDate = new Date();
atualizarResultado();