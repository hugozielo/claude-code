# 🎮 Pac-Man Game

Um jogo clássico do Pac-Man implementado com JavaScript puro, HTML5 e CSS3.

## 🎯 Sobre o Jogo

Este é um clone do clássico jogo Pac-Man, onde você controla o Pac-Man através de um labirinto, comendo pontos e fugindo (ou perseguindo!) fantasmas.

## 🕹️ Como Jogar

1. Abra o arquivo `index.html` em seu navegador
2. Clique no botão "Iniciar Jogo"
3. Use as **setas do teclado** para mover o Pac-Man:
   - ⬆️ Seta para cima
   - ⬇️ Seta para baixo
   - ⬅️ Seta para esquerda
   - ➡️ Seta para direita

## 🎲 Regras do Jogo

- **Objetivo**: Comer todos os pontos no labirinto
- **Pontos pequenos**: +10 pontos
- **Power Pellets** (pontos grandes): +50 pontos
- **Fantasmas comidos** (no modo power): +200 pontos
- **Vidas**: Você começa com 3 vidas
- **Power Mode**: Ao comer um power pellet, você pode comer os fantasmas por 7 segundos

## 👻 Fantasmas

O jogo conta com 4 fantasmas, cada um com sua própria cor:
- 🔴 **Blinky** (Vermelho)
- 🩷 **Pinky** (Rosa)
- 🩵 **Inky** (Ciano)
- 🟠 **Clyde** (Laranja)

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)

## 📂 Estrutura do Projeto

```
pacman/
│
├── index.html      # Estrutura HTML do jogo
├── style.css       # Estilos e animações
├── game.js         # Lógica do jogo
└── README.md       # Documentação
```

## 🚀 Como Executar

### Opção 1: Localmente
1. Clone este repositório
2. Abra o arquivo `index.html` em qualquer navegador moderno

### Opção 2: Servidor Local
```bash
# Se você tiver Python instalado
python -m http.server 8000

# Ou com Node.js
npx http-server
```

Depois acesse `http://localhost:8000` no navegador.

## 🎨 Características

- ✅ Interface responsiva
- ✅ Animações suaves
- ✅ Sistema de pontuação
- ✅ Sistema de vidas
- ✅ Power pellets funcionais
- ✅ IA básica para os fantasmas
- ✅ Detecção de colisão
- ✅ Tela de Game Over
- ✅ Opção de reiniciar o jogo

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 🎮 Divirta-se!

Aproveite o jogo e tente fazer a maior pontuação possível! 👾