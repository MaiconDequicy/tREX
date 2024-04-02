//trabalho de PW - tRex - Engenharia de Software

(function () 
{
  const FPS = 300;
  const HEIGHT = 300;
  const WIDTH = 1024;
  const PROB_NUVEM = 1;

  const LARGURA_DO_DINOSSAURO = 44;
  const ALTURA_DO_DINOSSAURO = 47;
  const LARGURA_DO_CACTO = 17;
  const ALTURA_DO_CACTO = 35;
  const LARGURA_DO_PTEROSSAURO = 46;
  const ALTURA_DO_PTEROSSAURO = 40;

  let encerraJogo = false;
  let tempoJogo = 0;
  let velocidade = 1;
  let gameLoop;
  let deserto;
  let dino;
  let nuvens = [];
  let cactos = [];
  let pterossauros = []
  let frame = 0;
  let jogoIniciado = false;
  let turno = "Dia";

  //coisas da div pontuação
  let cont = 0;
  let pontuacao = document.getElementById("contador");
  pontuacao.style.position = "absolute";
  pontuacao.style.left = "1150px"
  pontuacao.style.zIndex = "3";
  pontuacao.style.transform = "translate(20px, 20px)"
  
  function init() 
  {
    gameLoop = setInterval(run, 1000 / FPS)
    deserto = new Deserto();
    dino = new Dino();
    
    setInterval(()=>
    {
      deserto.alterarTurno();
    }, 60000);
  }
  
  window.addEventListener("keydown", (e) => 
  {
    if (e.code === "Space") 
    {
      if (dino.status === 0)
      {
        dino.status = 1;
      }
    }
    if(!jogoIniciado && e.code === "Space")
    {
      jogoIniciado = true;
    }
    else if (e.code === "KeyP") 
    {
      jogoIniciado = !jogoIniciado;
      clearInterval(alterarTurno()); 
    }
    else if(e.code === "ArrowDown" && dino.status === 0)
    {
      dino.status = 3;
    }
  });

  window.addEventListener("keyup", (e) => 
  {
    if (e.code === "ArrowDown" && dino.status === 3) 
    {
        dino.status = 0; 
    }
  });

  class Deserto 
  {
    constructor() 
    {
      this.element = document.createElement("div")
      this.element.className = "deserto";
      this.element.style.width = `${WIDTH}px`;
      this.element.style.height = `${HEIGHT}px`;
      document.getElementById("game").appendChild(this.element)

      this.chao = document.createElement("div")
      this.chao.className = "chao"
      this.chao.style.backgroundPositionX = 0;
      this.element.appendChild(this.chao);
    }
    mover() 
    {
      this.chao.style.backgroundPositionX = `${parseInt(this.chao.style.backgroundPositionX) - 2}px`
    }

    alterarTurno()
    {
      if(!jogoIniciado === true || encerraJogo) return;

      if(turno === "Dia")
      {
        deserto.element.style.backgroundColor = "#333";
        turno = "Noite";
        pontuacao.style.color = "#ffffff";
      }
      else
      {
        deserto.element.style.backgroundColor = "#ffffff";
        turno = "Dia";
        pontuacao.style.color = "#333";
      }
    }
  }

  class Dino 
  {
    #status
    constructor() 
    {
      this.backgroundPositionsX = 
      {
        correndo1: "-1391px",
        correndo2: "-1457px",
        pulando: "-1259px",
        deitado1: "-1652px",
        deitado2: "-1741px",
        parado: "-1259px",
        batido: "-1523px",
      }
      this.agachado = false;
      this.#status = 0; // 0-correndo, 1-subindo, 2-descendo, 3 - deitado, 4 - parado 
      this.altumaMinima = 2;
      this.altumaMaxima = 110;
      this.element = document.createElement("div")
      this.element.className = "dino";
      this.element.style.backgroundPositionX = this.backgroundPositionsX.parado;
      this.element.style.backgroundPositionY = "-2px";
      this.element.style.bottom = `${this.altumaMinima}px`
      deserto.element.appendChild(this.element)
    }
    /**
     * @param {number} value
     */
    set status(value) 
    {
      if (value >= 0 && value <= 5) this.#status = value;
    }
    get status() 
    {
      return this.#status;
    }
    correr()
     {
      if(!jogoIniciado) return;

      if (this.#status === 0 && frame % 20 === 0) this.element.style.backgroundPositionX = this.element.style.backgroundPositionX === this.backgroundPositionsX.correndo1 ? this.backgroundPositionsX.correndo2 : this.backgroundPositionsX.correndo1;
      
      else if (this.#status === 1)
       {
        this.element.style.backgroundPositionX = this.backgroundPositionsX.pulando;
        this.element.style.bottom = `${parseInt(this.element.style.bottom) + 2}px`;
        if (parseInt(this.element.style.bottom) >= this.altumaMaxima) this.status = 2;
      }
      else if (this.#status === 2) 
      {
        this.element.style.bottom = `${parseInt(this.element.style.bottom) - 2}px`;
        if (parseInt(this.element.style.bottom) <= this.altumaMinima) this.status = 0;
        
      }
      else if (this.#status === 3) 
      {  
        if(frame % 20 === 0 ) this.element.style.backgroundPositionX = this.element.style.backgroundPositionX === this.backgroundPositionsX.deitado1 ? this.backgroundPositionsX.deitado2 : this.backgroundPositionsX.deitado1;
      }
    }
  }

  class Nuvem 
  {
    constructor() 
    {
      this.element = document.createElement("div");
      this.element.className = "nuvem";
      this.element.style.right = 0;
      this.element.style.top = `${parseInt(Math.random() * 150)}px`
      this.larguraDaNuvem = this.element.offsetWidth;
      deserto.element.appendChild(this.element);
    }
    mover() 
    { 
      this.element.style.right = `${parseFloat(this.element.style.right) + 0.9}px`;
    }
  }

  class Pterossauro
  {

    constructor() 
    {
      this.backgroundPositionX =
      {
        batendoAsas01: "-196px",
        batendoAsas02: "-266px",
      }
      this.asasPosition = 0;
      this.element = document.createElement("div");
      this.element.className = "pterossauro";
      this.element.style.right = 0;
      this.element.style.top = `${parseInt(Math.random() * 200)}px`
      deserto.element.appendChild(this.element);
    }
    baterAsas()
    {
      // Alterna a posição das asas
      if (frame % 20 === 0) 
      { 
        this.asasPosition = this.asasPosition === 0 ? 1 : 0;
        this.element.style.backgroundPositionX = this.asasPosition === 0 ? this.backgroundPositionX.batendoAsas01 : this.backgroundPositionX.batendoAsas02;
      }
    }
    mover() 
    { 
      this.element.style.right = `${parseFloat(this.element.style.right) + 5}px`;
    }
  }

  class Cactos
  {
    constructor()
    {
      this.element = document.createElement("div");
      this.element.style.right = 0;
      this.element.style.bottom = 0;

      deserto.element.appendChild(this.element);

      this.selecionarCacto();
      this.element.className = this.seletorCacto;
    }

    //seleciona um seletor css para gerar os cactos do jogo
    selecionarCacto()
    {
      let seletores = ["cactoPequenoUnico", "cactoPequenoDuplo", "cactoPequenoTriplo", "cactoGrandeSozinho", "cactoGrandeDuplo", "cactoGrandeTriplo"];
      let randomIndice = Math.floor(Math.random() * seletores.length);
      this.seletorCacto = seletores[randomIndice];
    }

    mover()
    {
      this.element.style.right = `${parseInt(this.element.style.right) + 4}px`;
    }
  }

  function mostrarGameOver()
  {
    const divGameOver = document.createElement("div");
    
    divGameOver.textContent = "G A M E  O V E R ";
    divGameOver.style.position = "absolute";
    divGameOver.style.top = "50%";
    divGameOver.style.left = "50%";
    divGameOver.style.transform = "translate(-50%, -50%)";
    divGameOver.style.fontSize = "36px";
    divGameOver.style.color = "#777777";
    divGameOver.style.zIndex = 4;
    
    deserto.element.appendChild(divGameOver);
  }

  function verificarColisoes() {
    if (encerraJogo) {
      return; // Se o jogo já foi encerrado, não faz nada
    }
  
    cactos.forEach(cacto => 
    {
      if
       (
        dino.element.offsetLeft < cacto.element.offsetLeft + LARGURA_DO_CACTO &&
        dino.element.offsetLeft + LARGURA_DO_DINOSSAURO > cacto.element.offsetLeft &&
        dino.element.offsetTop + ALTURA_DO_DINOSSAURO > cacto.element.offsetTop
      )
       {
        // Muda a posição do dinossauro para a posição "Game Over"
        dino.element.style.backgroundPositionX = "-1523px";
        // Encerra o jogo
        encerraJogo = true;
        mostrarGameOver(); 
      }
      if (jogoIniciado && encerraJogo) 
      {
        clearInterval(gameLoop);
      }
    });

    pterossauros.forEach(pterossauro =>
    {
      if 
      (
        dino.element.offsetLeft < pterossauro.element.offsetLeft + LARGURA_DO_PTEROSSAURO &&
        dino.element.offsetLeft + LARGURA_DO_DINOSSAURO > pterossauro.element.offsetLeft &&
        dino.element.offsetTop < pterossauro.element.offsetTop + ALTURA_DO_PTEROSSAURO &&
        dino.element.offsetTop + ALTURA_DO_DINOSSAURO > pterossauro.element.offsetTop
      )
       {
        // Muda a posição do dinossauro para "Game Over"
        dino.element.style.backgroundPositionX = "-1523px";
        // Encerra o jogo
        encerraJogo = true;
        mostrarGameOver();  
      }
      
      if (jogoIniciado && encerraJogo) 
      {
        clearInterval(gameLoop);
      }
    });
  
  }

  function run() 
  {
    if(!jogoIniciado) return;

    frame = frame + 1;
  
    tempoJogo = tempoJogo + 1;

    if (frame === FPS) frame = 0;
    deserto.mover()
    dino.correr()

    //gera nuvens
    if (Math.random() * 500 <= PROB_NUVEM) nuvens.push(new Nuvem());

    //gera cactos
    if((Math.random()  * 100 ) <= 0.085)
    {
       cactos.push(new Cactos());
    }

    //gera pteroussauros
    if((Math.random() * 100) <= 0.050)
    {
      pterossauros.push(pterossauro = new Pterossauro());
    }
    if(frame % 2 === 0)
    {
      cactos.forEach(cacto=> cacto.mover());
      nuvens.forEach(nuvem => nuvem.mover());
      
      pterossauros.forEach(pterossauro=>
      {
        pterossauro.mover();
        pterossauro.baterAsas();
      });
    }
    if(frame % 30 === 0)
    {
      cont = cont + 1;
      pontuacao.textContent = String(cont).padStart(5, '0');
    }
    
    verificarColisoes();
    
    if (cactos.length > 5 && cactos[0].element.offsetLeft + LARGURA_DO_CACTO < 0)
    {
      cactos[0].element.remove();
      cactos.shift();
    }
    
    if (pterossauros.length > 5 && pterossauros[0].element.offsetLeft + LARGURA_DO_PTEROSSAURO < 0) 
    {
      pterossauros[0].element.remove();
      pterossauros.shift();
    }

    if(nuvens.length > 5 && nuvens[0].element.offsetLeft + larguraDaNuvem < 0)
    {
      nuvens[0].element.remove();
      nuvens.shift();
    }
  }
  init()
})();