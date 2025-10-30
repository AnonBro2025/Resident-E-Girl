
// ===== Nora Final Sprite Controls =====
function showNoraFinal(){
  const nf = document.getElementById('noraFinal');
  const babe = document.getElementById('babe');
  if (nf){
    nf.src = 'NoraFinal.png';
    nf.style.display = 'block';
  }
  if (babe){ babe.style.display = 'none'; }
}
function hideNoraFinal(){
  const nf = document.getElementById('noraFinal');
  const babe = document.getElementById('babe');
  if (nf){ nf.style.display = 'none'; }
  if (babe){ babe.style.display = 'block'; }
}
/* House of Echoes — flat-file version */
(() => {
  const bgEl = document.getElementById('bg');
  const babeEl = document.getElementById('babe');
  const nameEl = document.getElementById('name');
  const textEl = document.getElementById('text');
  const choicesEl = document.getElementById('choices');
  const choiceAEl = document.getElementById('choiceA');
  const choiceBEl = document.getElementById('choiceB');
  const overlayEl = document.getElementById('overlay');
  const restartEl = document.getElementById('restart');

  let roomIndex = 0;
  let lineIndex = 0;
  let typing = false;
  let skipType = false;

  function setBackground(url){
    bgEl.style.backgroundImage = `url('${url}')`;
  }
  function setSprite(url){
    babeEl.src = url;
    requestAnimationFrame(() => {
      babeEl.style.opacity = '1';
      if (babeEl.classList.contains('nora-final')){
        babeEl.style.transform = 'translateX(-50%) translateY(-18%) scale(1.35)';
      } else {
        babeEl.style.transform = 'translateX(-50%) translateY(0)';
      }
    });
  }

  function typeText(text, speed=28){
    typing = true;
    textEl.textContent = '';
    let i = 0;
    const id = setInterval(() => {
      if (skipType){
        textEl.textContent = text;
        clearInterval(id);
        typing = false;
        skipType = false;
        showChoices();
        return;
      }
      textEl.textContent += text[i++];
      if (i >= text.length){
        clearInterval(id);
        typing = false;
        showChoices();
      }
    }, speed);
  }

  function showChoices(){
    const line = currentLine();
    const isFinal = (lineIndex >= currentRoom().lines.length - 1);
    if (isFinal){
      choiceAEl.textContent = `⟵ Shoot`;
      choiceBEl.textContent = `Romance ⟶`;
      choiceAEl.classList.add('primary');
      choiceBEl.classList.remove('primary');
    } else {
      choiceAEl.textContent = `⟵ ${line.a}`;
      choiceBEl.textContent = `${line.b} ⟶`;
      choiceAEl.classList.add('primary');
      choiceBEl.classList.remove('primary');
    }
    choicesEl.classList.remove('hidden');
}{
    const line = currentLine();
    choiceAEl.textContent = `⟵ ${line.a}`;
    choiceBEl.textContent = `${line.b} ⟶`;
    choiceAEl.classList.add('primary');
    choiceBEl.classList.remove('primary');
    choicesEl.classList.remove('hidden');
  }

  function currentRoom(){ return GAME_DATA[roomIndex]; }
  function currentLine(){ return currentRoom().lines[lineIndex]; }

  function getSprite(room, idx){
    // Nora's final gambit sprite
    if (room.name === 'Nora' && idx >= room.lines.length - 1){
      return 'NoraFinal.png';
    }
    return room.sprite;
  }

  function render(){
    const room = currentRoom();
    setBackground(room.bg);
    setSprite(getSprite(room, lineIndex));
    nameEl.textContent = room.name;
    /* Nora final toggle */
    if (room.name === 'Nora' && lineIndex >= room.lines.length - 1){
      showNoraFinal();
    } else {
      hideNoraFinal();
    }
    typeText(currentLine().line);
  }

  function acceptAdvance(){
    const dead = Math.random() < 0.5;
    if (dead){
      killPlayer();
    } else {
      nextLine();
    }
  }
  function rejectAdvance(){
    nextLine();
  }

  function nextLine(){
    choicesEl.classList.add('hidden');
    lineIndex++;
    if (lineIndex >= currentRoom().lines.length){
      roomIndex++;
      lineIndex = 0;
      if (roomIndex >= GAME_DATA.length){
        overlayEl.classList.remove('hidden');
        overlayEl.querySelector('#overlayText').textContent = 'You made it out.';
        return;
      }
    }
    babeEl.style.opacity = '0';
    babeEl.style.transform = 'translateX(-50%) translateY(8%)';
    setTimeout(() => { render(); }, 250);
  }

  function killPlayer(){
    overlayEl.classList.remove('hidden');
    overlayEl.querySelector('#overlayText').textContent = 'You are dead.';
  }

  document.addEventListener('click', (e) => {
    if (typing){
      skipType = true;
    }
  });
  function shootAnimation(done){
    const gun = document.getElementById('gun');
    const flash = document.getElementById('muzzle');
    gun.src = 'gun.png';
    flash.src = 'muzzle.png';

    gun.classList.add('gun-top');
    flash.classList.add('gun-top');
    gun.classList.add('gun-top');
    flash.classList.add('gun-top');
    gun.classList.add('gun-in'); // raise (250ms)
    let shots = 0;
    function fire(){
      // recoil + flash
      gun.classList.add('gun-recoil');
      /* center muzzle flash */
      try {
        const flash = document.getElementById('muzzle');
        if (flash){
          flash.style.position='fixed';
          flash.style.left='50%';
          flash.style.top='50%';
          flash.style.transform='translate(-50%, -50%)';
          flash.style.maxHeight='20vh';
        }
      } catch(e){}

      try {
        const nf = document.getElementById('noraFinal');
        const babe = document.getElementById('babe');
        const target = (nf && nf.style && nf.style.display !== 'none') ? nf : babe;
        if (target) {
          target.classList.add('egirl-hit');
          setTimeout(() => target.classList.remove('egirl-hit'), 160);
        }
      } catch (e) {}

      flash.classList.add('flash-on');
      setTimeout(() => {
        gun.classList.remove('gun-recoil');
        flash.classList.remove('flash-on');
        shots++;
        if (shots < 3){
          setTimeout(fire, 260); // time between shots
        } else {
          // lower gun after final shot
          setTimeout(() => {
            gun.classList.remove('gun-in');
            gun.classList.remove('gun-top');
            flash.classList.remove('gun-top');
            flash.style.position='absolute'; flash.style.left=''; flash.style.top=''; flash.style.right='0'; flash.style.bottom='0'; flash.style.transform='';
            gun.classList.remove('gun-top');
            flash.classList.remove('gun-top');
            done && done();
          }, 380);
        }
      }, 140);
    }
    setTimeout(fire, 260); // delay after raise before first shot
  }

choiceAEl.addEventListener('click', (e) => {
    e.stopPropagation();
      // If on final line, 'Shoot' defeats succubus and moves to next room
  if (lineIndex >= currentRoom().lines.length - 1){
    choicesEl.classList.add('hidden');
    shootAnimation(() => {
      // mark room complete and move forward
      nextLine();
    });
  } else {
    rejectAdvance();
  }
  });
  choiceBEl.addEventListener('click', (e) => {
    e.stopPropagation();
      // If on final line, 'Romance' triggers death immediately
  if (lineIndex >= currentRoom().lines.length - 1){
    choicesEl.classList.add('hidden');
    killPlayer();
  } else {
    acceptAdvance();
  }
  });
  restartEl.addEventListener('click', () => {
    overlayEl.classList.add('hidden');
    roomIndex = 0; lineIndex = 0; typing = false; skipType = false;
    babeEl.style.opacity = '0';
    babeEl.style.transform = 'translateX(-50%) translateY(8%)';
    setTimeout(() => render(), 150);
  });

  render();
})();

// ===== Start Screen control =====
(function(){
  const start = document.getElementById('startScreen');
  const btn = document.getElementById('startBtn');
  if (start && btn){
    btn.addEventListener('click', () => {
      start.style.display = 'none';
      // Ensure first render if not already drawn
      try{ if (typeof render === 'function') render(); }catch(e){}
    });
  }
})();
