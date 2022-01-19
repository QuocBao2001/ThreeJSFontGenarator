import * as THREE from './js/three'
import { FontLoader } from './js/FontLoader'

// đoạn text mặc định là đồ họa máy tính
let text = 'Đồ họa máy tính\nComputer Graphics';
// fonMesh là mesh font chữ
let fontMesh;
// đánh dấu key input đầu tiên là chữ đầu tiên
let firstLetter = true;
// lấy canvas
let canvas = document.getElementById("bg");
// màu mặc định
let color = "#005500";
// kích thước mặc định
let size = 12
// font chữ mặc định
let fontName = '/fonts/font6.json';
// background mặc định
let background = new Image();
background.src = "images/image1.png";
// Vị trí mặc định của chữ
let currentPlace = 1;

// Tạo background
const bgtexture = new THREE.TextureLoader().load(background.src);
const backgroundShape = new THREE.PlaneGeometry(2, 2);
const bgMaterial = new THREE.MeshBasicMaterial({
	map: bgtexture
})
let backgroundMesh = new THREE.Mesh(backgroundShape, bgMaterial);

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Tạo background scene và camera
let backgroundScene = new THREE.Scene();
let backgroundCamera = new THREE.Camera();

backgroundScene.add(backgroundMesh);

// Tạo scene và camera của chữ
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg"), preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

// load font
const loader = new FontLoader();
loader.load(fontName, function (font) {
	const textShape = font.generateShapes(text, size);
	const fontGeometry = new THREE.ShapeGeometry(textShape, 12);

	var fontMaterial = new THREE.MeshBasicMaterial({
		color: color,
		transparent: true,
		side: THREE.DoubleSide,
		//wireframe: true
	})

	fontMesh = new THREE.Mesh(fontGeometry, fontMaterial);

	fontMesh.position.x = -70;
	fontMesh.position.z = -95;
	fontMesh.position.y = 0;
	fontMesh.rotateX(-0.5);
	fontMesh.rotateY(0.3);
	fontMesh.rotateZ(-0.03);

	scene.add(fontMesh);
});

camera.position.z = 30;

// vẽ 2 scene lên 1 canvas
var render = function () {
	// Xóa màn hình cũ
	renderer.autoClear = true;
	renderer.render(backgroundScene, backgroundCamera);
	//Không sóa màn hình background mà vẽ đè màn hình chữ lên
	renderer.autoClear = false;
	renderer.render(scene, camera);
};

// vòng lặp gameLoop
var GameLoop = function () {
	requestAnimationFrame(GameLoop);
	render();
};

GameLoop();

// Xử lý thay đổi kích thước cửa sổ
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
}

// Tạo ra ảnh bằng cách click button makeImage
document.getElementById('makeImage').addEventListener('click', () => {
	let image = new Image();
	image.src = canvas.toDataURL();
	document.getElementById('imageList').appendChild(image);
})

// Tạo ra nhiều ảnh cùng lúc
let ite = 10;
function genarateLoop() {
	setTimeout(() => {
		// Lưu ảnh canvas hiện tại vào danh sách
		let image = new Image();
		image.src = canvas.toDataURL();
		document.getElementById('imageList').appendChild(image);
		if (ite == 69) {
			ite = 10;
			refreshText(1);
			background.src = "images/image" + 1 + ".png";
			refreshBackground();
			return;
		}
		// Tạo lần lượt các màu khác nhau, font khác nhau, kích thước khác nhau, background khác nhau
		let ImageIndex = Math.floor(ite / 10);
		color = '#' + Math.floor(Math.random() * 16777215).toString(16);
		fontIndex = Math.ceil(Math.random() * 6);
		fontName = '/fonts/font' + fontIndex + '.json';
		size = 5 + Math.floor(Math.random() * 7);
		refreshText(ImageIndex);
		background.src = "images/image" + ImageIndex + ".png";
		refreshBackground();
		ite++;
		// Tiếp tục tạo khi ite < 70
		genarateLoop();
	}, 200);
}

// Tạo nhiều ảnh bằng cách click button makeMultiImage
document.getElementById('makeMultiImage').addEventListener('click', () => {
	genarateLoop();
})

// Đổi màu bằng input color
let colorWell = document.querySelector("#slColor");
colorWell.value = color;
colorWell.addEventListener("input", updateColor, false);

function updateColor(event) {
	color = event.target.value;
	refreshText(currentPlace);
}

// Đổi kích thước bằng input size
let sizeSelect = document.querySelector("#slSize");
sizeSelect.value = 12;
sizeSelect.addEventListener("input", updateSize, false);

function updateSize(event) {
	size = event.target.value;
	refreshText(currentPlace);
}

// Thay đổi font chữ
let fontSelect = document.querySelector("#slFonts");
fontSelect.value = "Roboto";
fontSelect.addEventListener("change", updateFonts);

function updateFonts(event) {
	console.log(event.target.value);
	switch (event.target.value) {
		case "Luxurious":
			fontName = '/fonts/font3.json';
			break;
		case "Roboto":
			fontName = '/fonts/font6.json';
			break;
		case "Dancing Script":
			fontName = '/fonts/font1.json';
			break;
		case "Dongle":
			fontName = '/fonts/font2.json';
			break;
		case "Merriweather":
			fontName = '/fonts/font4.json';
			break;
		case "Pacifico":
			fontName = '/fonts/font5.json';
			break;
	}
	refreshText(currentPlace);
}

// Thay đổi x
let xPositionSl = document.querySelector("#slXPos");
xPositionSl.value = 0;
xPositionSl.addEventListener("input", updateXPos, false);

function updateXPos(event) {
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		obj.position.x = parseFloat(event.target.value);
	}
}

// Thay đổi y
let yPositionSl = document.querySelector("#slYPos");
yPositionSl.value = 0;
yPositionSl.addEventListener("input", updateYPos, false);

function updateYPos(event) {
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		obj.position.y = parseFloat(event.target.value);
	}
}

// Thay đổi z
let zPositionSl = document.querySelector("#slZPos");
zPositionSl.value = 0;
zPositionSl.addEventListener("input", updateZPos, false);

function updateZPos(event) {
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		obj.position.z = parseFloat(event.target.value);
	}
}

// Thay đổi góc xoay quanh x
let xRotateSl = document.querySelector("#slXRot");
xRotateSl.value = 0;
xRotateSl.addEventListener("input", updateXRot, false);

function updateXRot(event) {
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		obj.rotation.x = parseFloat(event.target.value / 100);
	}
}

// Thay đổi góc xoay quanh y
let yRotateSl = document.querySelector("#slYRot");
yRotateSl.value = 0;
yRotateSl.addEventListener("input", updateYRot, false);

function updateYRot(event) {
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		obj.rotation.y = parseFloat(event.target.value / 100);
	}
}

// Thay đổi góc xoay quanh z
let zRotateSl = document.querySelector("#slZRot");
zRotateSl.value = 0;
zRotateSl.addEventListener("input", updateZRot, false);

function updateZRot(event) {
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		obj.rotation.z = parseFloat(event.target.value / 100);
	}
}

// Thay đổi phông nền
let backgroundSelect = document.querySelector("#slImages");
backgroundSelect.value = "image1";
backgroundSelect.addEventListener("change", updateBackground);

function updateBackground(event) {
	switch (event.target.value) {
		case "image1":
			background.src = "images/image1.png";
			currentPlace = 1;
			break;
		case "image2":
			background.src = "images/image2.png";
			currentPlace = 2;
			break;
		case "image3":
			background.src = "images/image3.png";
			currentPlace = 3;
			break;
		case "image4":
			background.src = "images/image4.png";
			currentPlace = 4;
			break;
		case "image5":
			background.src = "images/image5.png";
			currentPlace = 5;
			break;
		case "image6":
			background.src = "images/image6.png";
			currentPlace = 6;
			break;
	}
	refreshText(currentPlace);
	refreshBackground();
}

// Nhận sự kiện ấn phím để thay đổi chữ
document.addEventListener('keypress', onCanvasKeyPress);
document.addEventListener('keydown', onCanvasKeyDown);

function onCanvasKeyDown(event) {
	const keyCode = event.keyCode;

	// backspace

	if (keyCode == 8) {
		console.log(keyCode);
		event.preventDefault();

		text = text.substring(0, text.length - 1);
		refreshText(currentPlace);
	}

}

// Nhận sự kiện phím để thay đổi chữ
function onCanvasKeyPress(event) {
	if (firstLetter) {

		firstLetter = false;
		text = '';

	}

	const keyCode = event.which;

	// backspace
	if (keyCode == 8) {
		event.preventDefault();
	} else {
		if (keyCode == 13) {
			text += '\n';
		}
		else {
			const ch = String.fromCharCode(keyCode);
			text += ch;
		}

		refreshText(currentPlace);

	}

}

// Xóa chữ cũ, render lại chữ mới
function refreshText(currentPlace) {

	//updatePermalink();
	for (let i = scene.children.length - 1; i >= 0; i--) {
		obj = scene.children[i];
		scene.remove(obj);
	}

	if (!text) return;

	createText(currentPlace);

}

// Tạo chữ
function createText(i) {
	loader.load(fontName, function (font) {
		const textShape = font.generateShapes(text, size);
		const fontGeometry = new THREE.ShapeGeometry(textShape, 12);

		var fontMaterial = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			side: THREE.DoubleSide,
			//wireframe: true
		})

		fontMesh = new THREE.Mesh(fontGeometry, fontMaterial);

		// Tạo các góc nhìn mặc định cho từng background
		switch (i) {
			case 1:
				fontMesh.position.x = -70;
				fontMesh.position.z = -95;
				fontMesh.position.y = 0;
				fontMesh.rotateX(-0.5);
				fontMesh.rotateY(0.3);
				fontMesh.rotateZ(-0.03);
				break;
			case 2:
				fontMesh.position.x = -60;
				fontMesh.position.z = -60;
				fontMesh.position.y = 20;
				fontMesh.rotateX(-0.1);
				fontMesh.rotateY(0.2);
				fontMesh.rotateZ(-0.07);
				break;
			case 3:
				fontMesh.position.x = -30;
				fontMesh.position.z = -40;
				fontMesh.position.y = 15;
				fontMesh.rotateX(-0.0);
				fontMesh.rotateY(0.2);
				fontMesh.rotateZ(-0.23);
				break;
			case 4:
				fontMesh.position.x = -60;
				fontMesh.position.z = -60;
				fontMesh.position.y = 15;
				fontMesh.rotateX(0);
				fontMesh.rotateY(-0.04);
				fontMesh.rotateZ(0.02);
				break;
			case 5:
				fontMesh.position.x = -60;
				fontMesh.position.z = -50;
				fontMesh.position.y = 5;
				fontMesh.rotateX(0.03);
				fontMesh.rotateY(-0.04);
				fontMesh.rotateZ(0.04);
				break;
			case 6:
				fontMesh.position.x = -60;
				fontMesh.position.z = -50;
				fontMesh.position.y = 10;
				fontMesh.rotateX(0.02);
				fontMesh.rotateY(0.04);
				fontMesh.rotateZ(-0.15);
				break;
		}

		scene.add(fontMesh);
	});

}

// Xóa background cũ, render lại background mới
function refreshBackground() {

	//updatePermalink();
	backgroundScene.remove(backgroundMesh);

	createBackground();

}

// Tạo chữ
function createBackground() {
	// Tạo background
	const bgtexture = new THREE.TextureLoader().load(background.src);
	const backgroundShape = new THREE.PlaneGeometry(2, 2);
	const bgMaterial = new THREE.MeshBasicMaterial({
		map: bgtexture
	})
	backgroundMesh = new THREE.Mesh(backgroundShape, bgMaterial);

	backgroundMesh.material.depthTest = false;
	backgroundMesh.material.depthWrite = false;

	backgroundScene.add(backgroundMesh);
}
