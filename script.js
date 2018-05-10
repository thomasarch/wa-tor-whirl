
		// global variables
		let pixelSize = 10;
		const xPixels = 500 / pixelSize;
		const yPixels = 500 / pixelSize;
		let playSpeed = 100;


		//fish stuff
		var fishFertRate = 3;
		var fishWeight = 3;
		var startFishChi = 5;
		var fishType = 1;
		var startingFish = 500;

		

		//shark stuff
		var sharkFertRate = 16;
		var startSharkChi = 8;
		var sharkType = 2;
		var startingSharks = 10;


		var creatureList = [];
		var newList = [];

		var neighborDeltas = [
			{dx: -1, dy: 0},
			{dx: 1, dy: 0},
			{dx: 0, dy: 1},
			{dx: 0, dy: -1}
		];

	// declare global selectors
		const worldWrap = document.querySelector('.world-wrap');
		const sidebar = document.querySelector('.sidebar');

		const playButton = document.getElementById('play-button');
		const pauseButton = document.getElementById('pause-button');
		const restartButton = document.getElementById('restart-button');

		
	// world info
		document.getElementById('size-info').innerHTML = `${xPixels} x ${yPixels}`;
		let fishPop = creatureList.filter(x => x.type === 1).length;
		let sharkPop = creatureList.filter(x => x.type ===2).length;



	// side bar stuff
		document.getElementById('resolution').value = pixelSize;
		document.getElementById('play-speed').value = playSpeed;


		document.getElementById('startingFish').value = startingFish;
		document.getElementById('startFishChi').value = startFishChi;
		document.getElementById('fishFertRate').value = fishFertRate;

		document.getElementById('startingSharks').value = startingSharks;
		document.getElementById('startSharkChi').value = startSharkChi;
		document.getElementById('sharkFertRate').value = sharkFertRate;



		function formChanged() {
			pixelSize = Number(document.getElementById('resolution').value);
			playSpeed = Number(document.getElementById('play-speed').value);


			startingFish = Number(document.getElementById('startingFish').value);
			startFishChi = Number(document.getElementById('startFishChi').value);
			fishFertRate = Number(document.getElementById('fishFertRate').value);

			startingSharks = Number(document.getElementById('startingSharks').value);
			startSharkChi = Number(document.getElementById('startSharkChi').value);
			sharkFertRate = Number(document.getElementById('sharkFertRate').value);
		}

		function showSidebar() {
			sidebar.style.left = '0px';
		}

		function hideSidebar() {
			sidebar.style.left = '-200px';
		}




		
		// fill canvas
		const canvas = document.getElementById('world-canvas');
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = convertColor(0);
		ctx.fillRect(0,0,xPixels * pixelSize, yPixels * pixelSize);


		// color converter
		// if index number is input it returns rgba code, if rgba code input returns index nunmber
		function convertColor(colorCode){
			const colors = [
				'rgba(15,65,200,255)', //ocean blue - ocean - 0
				'rgba(231,203,111,255)', // - fish - 1
				'rgba(182,25,25,255)' //reddish - shark - 2
			];
			isNaN(colorCode) ?
				answer =  colors.findIndex(x => x === colorCode) :
				answer =  colors[colorCode]
			return answer;
		}


	// functions go here
		
		// random number generator
		function randNum(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max) + 1;
			let number = Math.floor(Math.random() * (max - min)) + min;
			return number;
		}

		// random coord generator
		function randCoord() {
			coord = []
			coord.push(randNum(0, xPixels - 1));
			coord.push(randNum(0, yPixels - 1));
			return coord;
		}

		// draws a cell at (x,y) coords of a set size, with a color converted from a list
		function drawCell(x, y, c) {
			ctx.fillStyle = convertColor(c);
			ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
		}

		// returns the index value of the color found at input coord
		function getCell(x, y) {
			let imgData = ctx.getImageData(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
			r = imgData.data[0];
			g = imgData.data[1];
			b = imgData.data[2];
			a = imgData.data[3];
			// console.log(`'rgba(${r},${g},${b},${a})'`);
			return convertColor(`rgba(${r},${g},${b},${a})`);
		}

	// creature creation
	//
	//
		// basic fish object
		function fish(x, y) {
			return {
				type: fishType,
				x: x,
				y: y,
				fert: 0,
				chi: startFishChi,
				weight: fishWeight
			}
		}

		//create new fish
		function createFish(x, y) {
			drawCell(x, y, fishType);
			newList.push(fish(x, y));
			// console.log('a fish was born!');
		}

		//basic shark object
		function shark(x, y) {
			return {
				type: sharkType,
				x: x,
				y: y,
				fert: 0,
				chi: startSharkChi
			}
		}

		//create new shark
		function createShark(x, y) {
			drawCell(x, y, sharkType);
			newList.push(shark(x, y));
			// console.log('a shark was born!');
		}


	// world building
	//
	//
	// populates with randoms with no repeats
		function populateWorld() {
			for(num = 0; num < startingFish;){ 
				let look = 0;
				let x = randNum(0, xPixels - 1);
				let y = randNum(0, yPixels - 1);
				look = getCell(x, y);
				if (look === 0) {
					createFish(x, y);
					num++;
				}		
			}

			for(num = 0; num < startingSharks;){ 
				let look = 0;
				let x = randNum(0, xPixels - 1);
				let y = randNum(0, yPixels - 1);
				look = getCell(x, y);
				if (look === 0) {
					createShark(x, y);
					num++;
				}		
			}
		}

	// movements
	//
	//
		//return creature object at set coords
		function getCreature(x, y) {
			let answer = creatureList.findIndex(c => (c.x === x && c.y === y));
			if (answer != -1) {
				return {object: creatureList[answer], index: answer, list: 0}
			} else {
				answer = newList.findIndex(c => (c.x === x && c.y === y));
				if (answer != -1) {
					return {object: newList[answer], index: answer, list: 1}
				}
			}	
		}


		//kill creature
		function killCreature(x, y) {
			food = getCreature(x, y);
			if (food.list === 0) {
				creatureList.splice(food.index, 1);
			} else {
				newList.splice(food.index, 1);
			}
		}


		// creatres list of possible moves
		function seeMoves(creature) {
			moveList = [];
			moves = [];
			type = creature.type;
			// console.log(type, 'lives at', creature.x, creature.y);

			// handles edge coords
			neighborDeltas.forEach(d => {
				var cellX = creature.x + d.dx;
				var cellY = creature.y + d.dy;

				cellX = (cellX === -1) ? (xPixels - 1) : cellX;
				cellY = (cellY === -1) ? (yPixels - 1) : cellY;
				cellX = (cellX === xPixels) ? 0 : cellX;
				cellY = (cellY === yPixels) ? 0 :cellY;

				var cellType = getCell(cellX, cellY);
				moveList.push({
					x: cellX,
					y: cellY,
					type: cellType
				});	
			});
			
			// console.log('all 4', moveList);
			// console.log('should be empty', moves.length)
			if (creature.type === sharkType) {
				// console.log('should only be sharks in here')
				moves = moveList.filter(x => x.type === 1);
			}
	
			if (moves.length != 0) {
				// console.log('fish', moves);
				return moves;
			} else {
				moves = moveList.filter(x => x.type === 0);
				// console.log('ocean', moves);
				return moves;
			}

			// moves = moveList.filter(x => x.type === 0);
			// console.log(moves);
			return moves;


		}

		function takeTurn(creature) {
			// console.log(creatureList.length, newList.length);
			seeMoves(creature);
			// console.log(creature.type, 'is here');
			if (creature.chi === 0) {
				
				drawCell(creature.x, creature.y, 0);
				// console.log('its ded');
			
			} else if (moves.length === 0) {
				
				// creature.fert += 1;
				newList.push(creature);
				// console.log('didnt move ********************');
				
			} else {
				var choice = moves.length - 1;
				var move = moves[randNum(0, choice)];
				let type = 0;
				
				if (creature.type === 1 && creature.fert >= fishFertRate) {
						type = 1;
						createFish(creature.x, creature.y);
						creature.fert = 0;
						// console.log('made bby');
				}
				if (creature.type === 2 && creature.fert >= sharkFertRate) {
						type = 2;
						createShark(creature.x, creature.y);
						creature.fert = 0;
						// console.log('made bby')
				}

				
					
				if (creature.type === 2 && move.type === 1) {			
					addTo = getCreature(move.x, move.y).object.weight;
					if (isNaN(addTo)) {
						// console.log('here it is');
					}
					creature.chi += addTo;

					killCreature(move.x, move.y);
					// console.log('ate fishy');
				
				}

				drawCell(creature.x, creature.y, type);
				drawCell(move.x, move.y, creature.type);
				
				creature.x = move.x;
				creature.y = move.y;
				creature.fert += 1;
				creature.chi -= 1;
				// console.log('moved');
				
				
				newList.push(creature);
				// console.log('pushed to new')
				// console.log('it moved');
				

			}
		}

		//chooses a move from move list
		
		creatureList = newList.splice(0);
		newList = [];

		var counter = 0;
		var turnOff = false;
		function popList() {
			
			while (creatureList.length > 0) {
				let creature = creatureList.pop();

				takeTurn(creature);
			}
			
			// console.log(newList.filter(x => isNaN(x.chi)));

			creatureList = newList.splice(0);
			newList = [];
			counter++;

			// update population info
			fishPop = creatureList.filter(x => x.type === 1).length;
			sharkPop = creatureList.filter(x => x.type ===2).length;
			document.getElementById('pop-totals').innerHTML = `fish: ${fishPop} sharks: ${sharkPop}`

			
			if (creatureList.length === 0 || creatureList.length === xPixels * yPixels || turnOff === true) { 
				// console.log('its over!')
			} else {
				window.setTimeout(popList, playSpeed);
			}
		}


		populateWorld();
		popList();

		


		// var stopInt = setInterval(function() {
		// 	(creatureList.length === 0 || creatureList.length === xPixels * yPixels) ? clearInterval(stopInt) : popList() 
		// 	// (creatureList.length === 0) ? clearInterval(stop) : popList() 
		// }, 100);
	
		// function stop() {
		// 	clearInterval(stopInt);
		// }
		
		function stopPlaying() {
			turnOff = true;
		}

		function restart() {
			turnOff = true;
			window.setTimeout(doRest, 100)
			function doRest() {
				newList = [];
				creatureList = [];
				ctx.fillStyle = convertColor(0);
				ctx.fillRect(0,0,xPixels * pixelSize, yPixels * pixelSize);
				populateWorld();
				turnOff = false;
				creatureList = newList.splice(0);
				newList = [];
				popList();
			}
		}

		function startPlaying() {
			turnOff = false;
			popList();
		}

		turnOff = true;
		

	// listeners
		sidebar.addEventListener('mouseover', showSidebar);
		sidebar.addEventListener('mouseout', hideSidebar);

		playButton.addEventListener('click', startPlaying);
		pauseButton.addEventListener('click', stopPlaying);
		restartButton.addEventListener('click', restart);

	