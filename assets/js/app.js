/* Interactive romantic single-page experience for Hasret */
document.addEventListener('DOMContentLoaded', () => {
	const panels = [...document.querySelectorAll('[data-panel]')];
		const showPanel = id => { 
			const wasHearts = document.getElementById('game-hearts').classList.contains('active') && document.getElementById('panel-games').classList.contains('active');
			panels.forEach(p=>p.classList.toggle('active', p.id === id));
			const nowHearts = id === 'panel-games' && document.querySelector('[data-game-tab].active')?.dataset.gameTab === 'hearts';
			if(wasHearts && !nowHearts){ stopHearts(); }
			if(!wasHearts && nowHearts){ startHearts(); }
		}; 
	document.addEventListener('click', e => {
		const next = e.target.closest('[data-next]');
		if(next){ showPanel(next.getAttribute('data-next')); window.scrollTo({top:0, behavior:'smooth'}); }
		if(e.target.matches('[data-restart]')){ location.reload(); }
	});

	/* Typewriter Love Letter */
	const letterEl = document.getElementById('loveLetter');
	const letterText = `Belki de kelimeler yetersiz kalır seni anlatmaya Hasret.\n\nGülüşünün içimde açtığı çiçekler var; her biri umut rengi. Sen aklıma düştüğünde gün daha pembe, hava daha ılık, dünya daha güzel.\n\nBu minicik sayfa kalbimin ritmini sana duyurmak için. Burada okuyacağın her şey, içimde sakladığım tatlı telaşın harfleri... 💖`;
	let i = 0; const speed = 35;
	function typeWriter(){ if(i <= letterText.length){ letterEl.textContent = letterText.slice(0,i++); setTimeout(typeWriter, letterText[i-2] === '\n' ? 200 : speed); } }
	typeWriter();

	/* Messages Carousel */
		const messages = [
			'Sen gülünce içimde kelebekler panik oluyor.',
			'Seni tanımak → günün en güzel kısmı.',
			'Bir bakışın, bütün günün ayarı: +∞ mutluluk.',
			'Adın kalbimde premium üyelik aldı.',
			'Parfümün değil, varlığın iz bırakıyor.',
			'Tesadüf değil: Kalbim seni seçti.',
			'Yanımda olman = Dünyanın kararlılık garantisi.',
			'Gözlerin sabah güneşi gibi içimi ısıtıyor.',
			'Sesinde huzurun tarifi var.',
			'Kalbimin en sevdiği ritim: adının yankısı.',
			'Sen yanımdaysan kalabalıklar bile sakinleşiyor.',
			'Gülüşün bugünümü “yarın da görmek istediğim” yaptı.',
			'Hayalimdeki tüm güzel cümlelerin öznesi sensin.',
			'Yanına yaklaştıkça içimde hava hep ılıkbahar.',
			'Bir “merhaba”n bile günü resetliyor.',
			'Seni düşünmek = moral güncellemesi %100.',
			'Kalbim: “Hasret online mı?” diye sürekli kontrol ediyor.',
			'Sen varsın ya… başka eksik hissetmiyorum.',
			'Bir insan bu kadar mı zarif hissedilir?',
			'Seninle geçen saniye, sensiz geçen saate bedel.',
		];
		const carouselEl = document.getElementById('messageCarousel');
		let msgIndex = 0; let carouselTimer; const carouselInterval = 4200;
		function renderMsg(nextIndex = msgIndex){
			carouselEl.classList.add('fade-out');
			setTimeout(()=>{ msgIndex = nextIndex; carouselEl.textContent = messages[msgIndex]; carouselEl.classList.remove('fade-out'); carouselEl.classList.add('fade-in'); setTimeout(()=>carouselEl.classList.remove('fade-in'), 450); }, 250);
		}
		function nextMsg(){ renderMsg((msgIndex + 1) % messages.length); }
		function prevMsg(){ renderMsg((msgIndex - 1 + messages.length) % messages.length); }
		function startCarousel(){ stopCarousel(); carouselTimer = setInterval(nextMsg, carouselInterval); }
		function stopCarousel(){ if(carouselTimer) clearInterval(carouselTimer); }
		renderMsg(0); startCarousel();
		const prevBtn = document.getElementById('prevMsg');
		const nextBtn = document.getElementById('nextMsg');
		prevBtn.addEventListener('click', ()=>{ prevMsg(); startCarousel(); });
		nextBtn.addEventListener('click', ()=>{ nextMsg(); startCarousel(); });
		carouselEl.addEventListener('mouseenter', stopCarousel);
		carouselEl.addEventListener('mouseleave', startCarousel);

	/* Tabs */
	const tabs = [...document.querySelectorAll('[data-game-tab]')];
	tabs.forEach(tab => tab.addEventListener('click', () => {
		tabs.forEach(t=>t.classList.toggle('active', t===tab));
		document.querySelectorAll('.game').forEach(g => g.classList.remove('active'));
		document.getElementById('game-' + tab.dataset.gameTab).classList.add('active');
	}));

	/* Heart Hunt Game */
	const heartArea = document.getElementById('heartGameArea');
	const heartScoreEl = document.getElementById('heartScore');
		let heartScore = 0; let heartTimer; let heartRunning=false;
	function spawnHeart(){
		if(!document.getElementById('game-hearts').classList.contains('active')) return; // only if visible
		const heart = document.createElement('span');
		heart.className = 'heart';
		heart.textContent = ['💗','💖','💘','💝','💞'][Math.floor(Math.random()*5)];
		const {clientWidth:w, clientHeight:h} = heartArea;
		const size = Math.max(28, Math.random()*52);
		heart.style.fontSize = size+'px';
		heart.style.left = Math.random() * (w - size) + 'px';
		heart.style.top = Math.random() * (h - size) + 'px';
		heart.setAttribute('role','button'); heart.setAttribute('tabindex','0');
		function collect(){ heartScore++; heartScoreEl.textContent = heartScore; heart.remove(); }
		heart.addEventListener('click', collect);
		heart.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' ') { collect(); e.preventDefault(); }});
		heartArea.appendChild(heart);
		setTimeout(()=>heart.remove(), 4500);
	}
		function startHearts(){ if(heartRunning) return; heartRunning=true; clearInterval(heartTimer); heartTimer = setInterval(spawnHeart, 900); }
		function stopHearts(){ heartRunning=false; clearInterval(heartTimer); }
		startHearts();
	const resizeObs = new ResizeObserver(()=>{}); resizeObs.observe(heartArea);

	/* Memory Game */
	const memoryGrid = document.getElementById('memoryGrid');
	const memoryStatus = document.getElementById('memoryStatus');
	const resetMemoryBtn = document.getElementById('resetMemory');
	let memoryFirst = null; let lockMemory=false; let matches=0; let totalPairs=0;
	function initMemory(){
		const icons = ['💗','💖','💘','💝','💞','💓','💕','💟'];
		const pick = icons.slice(0, 6); // 6 pairs
		const deck = shuffle([...pick, ...pick]);
		totalPairs = pick.length; matches=0; memoryGrid.innerHTML=''; memoryStatus.textContent='Haydi başlayalım!';
		deck.forEach((icon,i)=>{
			const card = document.createElement('button');
			card.className='memory-card'; card.type='button'; card.setAttribute('aria-label','Kart');
			card.innerHTML = `<div class="memory-inner"><div class="memory-face front"></div><div class="memory-face back">${icon}</div></div>`;
			card.addEventListener('click', ()=> flip(card, icon));
			memoryGrid.appendChild(card);
		});
	}
	function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()* (i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }
	function flip(card, icon){ if(lockMemory || card.classList.contains('flipped') || card.classList.contains('matched')) return; card.classList.add('flipped');
		if(!memoryFirst){ memoryFirst = {card, icon}; return; }
		const second = {card, icon};
		if(memoryFirst.icon === second.icon){ memoryFirst.card.classList.add('matched'); second.card.classList.add('matched'); matches++; memoryStatus.textContent = `${matches}/${totalPairs} eşleşme`; memoryFirst=null; if(matches===totalPairs){ memoryStatus.textContent='Hepsi eşleşti! 💯'; } }
		else { lockMemory=true; setTimeout(()=>{ memoryFirst.card.classList.remove('flipped'); second.card.classList.remove('flipped'); memoryFirst=null; lockMemory=false; }, 900); }
	}
	resetMemoryBtn.addEventListener('click', initMemory);
	initMemory();

	/* Yes / No Buttons */
	const btnYes = document.getElementById('btnYes');
	const btnNo = document.getElementById('btnNo');
	const panelYes = document.getElementById('panel-yes');
	const panelNo = document.getElementById('panel-no');
	let moveCount=0;
	function randomMove(){
		const parent = btnNo.parentElement; const rect = parent.getBoundingClientRect();
		const maxX = rect.width - btnNo.offsetWidth; const maxY = rect.height - btnNo.offsetHeight;
		const x = Math.random()*maxX; const y=Math.random()*maxY; btnNo.style.position='relative'; btnNo.style.left=x+'px'; btnNo.style.top=y+'px';
	}
		function evasive(){ if(moveCount<10){ randomMove(); moveCount++; } }
		btnNo.addEventListener('mouseenter', evasive);
		btnNo.addEventListener('touchstart', (e)=>{ evasive(); e.preventDefault(); }, {passive:false});
	btnNo.addEventListener('click', ()=>{ showPanel('panel-no'); capturePanel('panel-no','capturePreviewNo'); });
	document.getElementById('tryAgain').addEventListener('click', ()=>{ showPanel('panel-question'); });
	btnYes.addEventListener('click', ()=>{ showPanel('panel-yes'); celebrate(); capturePanel('panel-yes','capturePreview'); });

	function celebrate(){
		for(let i=0;i<28;i++){ setTimeout(spawnConfettiHeart, i*90); }
	}
	function spawnConfettiHeart(){
		const span = document.createElement('span'); span.textContent = ['💗','💖','💘','💕'][Math.floor(Math.random()*4)];
		span.style.position='fixed'; span.style.left = Math.random()*100+'%'; span.style.top='-40px'; span.style.fontSize= (Math.random()*24+20)+'px'; span.style.zIndex=9999; span.style.pointerEvents='none'; span.style.transition='transform 4s linear, opacity 4s';
		document.body.appendChild(span); requestAnimationFrame(()=>{ span.style.transform = `translateY(${window.innerHeight+160}px) rotate(${Math.random()>0.5?'' : '-'}${Math.random()*360}deg)`; span.style.opacity='0'; });
		setTimeout(()=>span.remove(), 4200);
	}

	/* Background floating hearts canvas */
	const bgCanvas = document.getElementById('hearts-bg'); const ctx = bgCanvas.getContext('2d');
	function resize(){ bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; }
	window.addEventListener('resize', resize); resize();
	const hearts = Array.from({length:55}).map(()=>({
		x: Math.random()*window.innerWidth,
		y: Math.random()*window.innerHeight,
		size: Math.random()*2+0.8,
		speed: Math.random()*0.4+0.15,
		wobble: Math.random()*40+20,
		phase: Math.random()*Math.PI*2
	}));
	function draw(){ ctx.clearRect(0,0,bgCanvas.width,bgCanvas.height); hearts.forEach(h=>{ h.y -= h.speed; h.phase += 0.02; h.x += Math.sin(h.phase)*0.3; if(h.y < -20){ h.y = bgCanvas.height+20; h.x = Math.random()*bgCanvas.width; } ctx.fillStyle='rgba(255,255,255,.75)'; ctx.beginPath(); heartPath(ctx, h.x, h.y, h.size*8); ctx.fill(); }); requestAnimationFrame(draw); }
		function heartPath(c, x, y, s){
			c.moveTo(x, y);
			c.bezierCurveTo(x, y - s/2, x - s, y - s/2, x - s, y);
			c.bezierCurveTo(x - s, y + s/2, x, y + s*0.9, x, y + s*0.3);
			c.bezierCurveTo(x, y + s*0.9, x + s, y + s/2, x + s, y);
			c.bezierCurveTo(x + s, y - s/2, x, y - s/2, x, y);
		}
	draw();

	/* Screenshot capture using html2canvas */
	function capturePanel(panelId, previewId){
		const panel = document.getElementById(panelId);
		if(!window.html2canvas) return;
		// Give time for animations/DOM updates
		setTimeout(()=>{
			html2canvas(panel, {backgroundColor:null, scale:2}).then(canvas => {
				const preview = document.getElementById(previewId);
				preview.innerHTML='';
				const img = document.createElement('img'); img.alt='Ekran görüntüsü'; img.src = canvas.toDataURL('image/png');
				preview.appendChild(img);
				const dl = document.createElement('a'); dl.href = img.src; dl.download = 'hasret-an.png'; dl.textContent='Görseli indir 📷'; dl.className='btn ghost'; preview.appendChild(dl);
			});
		}, 350);
	}
});

