// Ativa a webcam assim que a página carrega
window.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    if (video) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error("Erro ao acessar a webcam:", error);
            });
    }
    
    // Busca a praga do banco de dados assim que abre a página
    buscarDadosDoBanco();
});

// FUNÇÃO QUE CONECTA COM O SEU BACK-END (FASTAPI)
function buscarDadosDoBanco() {
    fetch('/ultima-analise')
        .then(response => response.json())
        .then(data => {
            const containerAlertas = document.getElementById('alertas-container');
            if (!containerAlertas) return;

            // Limpa os alertas estáticos antigos
            containerAlertas.innerHTML = '';

            // Se o banco retornar que tem praga, cria o card vermelho na tela
            if (data.praga && data.praga !== "Nenhuma praga detectada" && data.praga !== "Nenhum registro encontrado") {
                containerAlertas.innerHTML = `
                    <div class="card-alerta urgente">
                        <div class="alerta-header">
                            <span class="alerta-icone">⚠️</span>
                            <span class="alerta-titulo" id="alerta-titulo">${data.praga}</span>
                            <span class="alerta-zona">SETOR A</span>
                        </div>
                        <p class="alerta-desc">Praga identificada pelo sistema de IA no monitoramento.</p>
                    </div>
                `;
            } else {
                // Se estiver tudo limpo no banco, mostra que o sistema está seguro
                containerAlertas.innerHTML = `
                    <div class="card-alerta" style="border-left: 4px solid #00ff66;">
                        <div class="alerta-header">
                            <span class="alerta-icone">✅</span>
                            <span class="alerta-titulo" style="color: #00ff66;">Sistema Seguro</span>
                            <span class="alerta-zona">TODAS</span>
                        </div>
                        <p class="alerta-desc">Nenhuma praga detectada nas samambaias até o momento.</p>
                    </div>
                `;
            }
        })
        .catch(err => console.error("Erro ao buscar dados do FastAPI:", err));
}
/* ─── 5. Integração com o Back-end (FastAPI) ──────── */
function atualizarAlertasDoBanco() {
  fetch('http://localhost:8000/ultima-analise')
    .then(response => response.json())
    .then(data => {
      // Procura a seção onde ficam os alertas no HTML (buscando pela classe)
      const alertContainer = document.querySelector('.alerts-container');
      if (!alertContainer) return;

      // Se o banco retornar uma praga real, cria o card vermelho
      if (data.praga && data.praga !== "Nenhuma praga detectada" && data.praga !== "Nenhum registro encontrado") {
        alertContainer.innerHTML = `
          <div class="alert-card alert-red">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <div class="alert-title-row">
                <div class="alert-title" id="alerta-titulo">${data.praga}</div>
                <span class="alert-zone-badge badge-red">SETOR A</span>
              </div>
              <div class="alert-desc">Praga identificada pelo sistema de IA no monitoramento.</div>
            </div>
          </div>
        `;
      } else {
        // Se o banco estiver limpo ou disser "Nenhuma praga", mostra o card de sucesso
        alertContainer.innerHTML = `
          <div class="alert-card alert-blue" style="border-left: 4px solid var(--neon-green);">
            <div class="alert-icon">✅</div>
            <div class="alert-content">
              <div class="alert-title-row">
                <div class="alert-title" style="color: var(--neon-green); text-shadow: var(--glow-green);">SISTEMA SEGURO</div>
                <span class="alert-zone-badge badge-blue" style="background: rgba(0, 255, 136, 0.1); color: var(--neon-green); border: 1px solid var(--border-green-bright);">OK</span>
              </div>
              <div class="alert-desc">Nenhuma ameaça detectada nas samambaias.</div>
            </div>
          </div>
        `;
      }
    })
    .catch(err => console.error('[AgroVision] Erro ao conectar no FastAPI:', err));
}

// Inicializa a busca assim que a página carregar de verdade
window.addEventListener('DOMContentLoaded', () => {
  atualizarAlertasDoBanco();
  // Fica checando o banco a cada 3 segundos para ver se a IA mandou algo novo
  setInterval(atualizarAlertasDoBanco, 3000);
});