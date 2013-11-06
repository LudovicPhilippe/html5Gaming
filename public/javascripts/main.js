$(function() {
    'use strict';

    /* global THREE: false */

    var clock = new THREE.Clock();

    var container;

    var isRunning = false;

    var scene, renderer, camera, intScore = 0;

    var score = document.createElement('div'),
        title = document.createElement('div'),
        btnLB = document.createElement('div'),
        btnStart = document.createElement('div');

    var parent;
    var tube;
    var scale = 20;

    // Rotate a gate 1/4 par second
    var rotationSpeed = ((2.0 * Math.PI) / 4.0) / 1000;

    // Do a loop in 15 s
    var looptime = 15 * 1000;

    var t = 0.1;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var binormal = new THREE.Vector3();
    var normal = new THREE.Vector3();

    var sounds = ['../songs/Enemy_explode.wav',
            '../songs/Fire_smartbomb_low.wav',
            '../songs/Game_over.wav',
            '../songs/Game_start.wav',
            '../songs/Hi_Score_achieved.wav',
            '../songs/Musics/modified Shekinah & Hyperflex - Kavacha Mantra.mp3'];

    var audio = document.createElement('audio');
    var music = document.createElement('audio');

    function playSound(songToPlay){

        if(audio ){
            audio.removeAttribute("src");
        }
        audio.setAttribute('src',songToPlay);
        audio.play();
    }


    function playMusic(){

        if(audio ){
            music.removeAttribute("src");
        }
        music.setAttribute('src',sounds[5]);
        music.play();
    }

    var gates = [];

    var mouse = {
        x: 0,
        y: 0
    };

    var tubeMaterial;
    var CinquefoilKnot = new THREE.Curves.CinquefoilKnot(20);

    function addTube() {
        tube = new THREE.TubeGeometry(CinquefoilKnot, 800, 4, 24, true, false);


        tubeMaterial = new THREE.MeshLambertMaterial({
            ambient: 0xFFFFFF,
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            wireframe: true
        });

        var tubeMesh = new THREE.Mesh(tube, tubeMaterial);
        parent.add(tubeMesh);
        tubeMesh.scale.set(scale, scale, scale);
    }

    function addGates(parentObject, tubeGeometry) {
        var MAX_GATES = 13;

        var demiCircleGeometry = new THREE.CircleGeometry(4, 80, 0, Math.PI);
        var demiCircleMaterial = new THREE.MeshLambertMaterial({
            ambient: 0xFFFFFF,
            color: 0x0000FF,
            side: THREE.DoubleSide,
            opacity: 1.0,
        });

        var boundingBoxGeometry = new THREE.CubeGeometry(8, 4, 1);
        boundingBoxGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
        boundingBoxGeometry.computeBoundingBox();
        var boundingBoxMaterial = new THREE.MeshLambertMaterial({
            ambient: 0xFF0000,
            color: 0xFF0000,
            wireframe: true,
            side: THREE.DoubleSide,
            visible: false
        });

        var checkpointGeometry = new THREE.CubeGeometry(8, 8, 1);
        checkpointGeometry.computeBoundingBox();
        var checkpointMaterial = new THREE.MeshLambertMaterial({
            ambient: 0x00FF00,
            color: 0x00FF00,
            wireframe: true,
            side: THREE.DoubleSide,
            visible: false
        });


        for (var i = 0; i < MAX_GATES; i++) {
            var t = i / MAX_GATES;

            var position = tubeGeometry.path.getPointAt(t);
            position.multiplyScalar(scale);

            var direction = tube.path.getTangentAt(t);

            var lookAt = new THREE.Vector3();
            lookAt.copy(position).add(direction);

            var demiCircle = new THREE.Mesh(demiCircleGeometry, demiCircleMaterial);
            demiCircle.scale.set(scale, scale, scale);
            demiCircle.position.copy(position);
            demiCircle.lookAt(lookAt);
            demiCircle.rotation.z = Math.random() * Math.PI * 2.0;
            demiCircle.rotationDirection = Math.random() < 0.5 ? -1 : 1;
            parentObject.add(demiCircle);

            var boundingBox = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
            demiCircle.add(boundingBox);
            boundingBox.didCollide = false;

            var checkpoint = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
            demiCircle.add(checkpoint);
            checkpoint.didCollide = false;
            gates.push(demiCircle);
        }
    }

    function mainMenuInit(){

        var containerMainMenu = document.createElement('div');
        containerMainMenu.setAttribute('id', 'containerMainMenu');
        containerMainMenu.style.zIndex = 0;
        document.body.appendChild(containerMainMenu);


        title.style.position = 'absolute';
        title.style.zIndex = 1000;
        title.style.top = '10px';
        title.style.width = '100%';
        title.style.textAlign = 'center';
        title.innerHTML = '<h1>' + 'html5Gaming' + '</h1>';


        btnStart.style.position = 'absolute';
        btnStart.style.zIndex = 1000;
        btnStart.style.top = '200px';
        btnStart.style.width = '100%';
        btnStart.style.textAlign = 'center';
        btnStart.innerHTML = '<button>' + 'Play' + '</button>';

        btnStart.onclick = function() { start(); };

        btnLB.style.position = 'absolute';
        btnLB.style.zIndex = 1000;
        btnLB.style.top = '400px';
        btnLB.style.width = '100%';
        btnLB.style.textAlign = 'center';
        btnLB.innerHTML = '<button>' + 'LeaderBoards' + '</button>';

        containerMainMenu.appendChild(title);
        containerMainMenu.appendChild(btnStart);
        containerMainMenu.appendChild(btnLB);
    }
    mainMenuInit();

    function init() {
        t = 0;
        isRunning = true;

        var elem = document.getElementById('containerMainMenu');
        elem.parentNode.removeChild(elem);

        container = document.createElement('div');
        container.setAttribute('id', 'container');
        container.style.zIndex = 0;
        document.body.appendChild(container);
        score.style.position = 'absolute';
        score.style.zIndex = 1000;
        score.style.top = '10px';
        score.style.width = '100%';
        score.style.textAlign = 'center';
        score.innerHTML = '<p>' + intScore + '</p>';

        scene = new THREE.Scene();

        var ambientLight = new THREE.AmbientLight(0xFFFFFF);
        scene.add(ambientLight);

        parent = new THREE.Object3D();
        parent.position.y = 100;
        scene.add(parent);

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 10000);
        parent.add(camera);

        addTube();
        addGates(parent, tube);

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setClearColor(0x000000, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);
        container.appendChild(score);
    }

    function render() {

        var delta = clock.getDelta() * 1000;

        t = (t + (delta / looptime)) % 1.0;

        var pos = tube.path.getPointAt(t);
        pos.multiplyScalar(scale);

        var dir = tube.path.getTangentAt((t + 0.015) % 1.0);

        var segments = tube.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor(pickt);
        var pickNext = (pick + 1) % segments;
        binormal.subVectors(tube.binormals[pickNext], tube.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(tube.binormals[pick]);
        normal.copy(binormal).cross(dir);


        camera.position = pos;

        var lookAt = new THREE.Vector3();
        lookAt.copy(pos).add(dir);
        camera.matrix.lookAt(pos, lookAt, normal);
        camera.rotation.setFromRotationMatrix(camera.matrix, camera.rotation.order);

        var max = 4 * scale;
        var mouseX = (mouse.x - windowHalfX) / windowHalfX;
        var mouseY = -(mouse.y - windowHalfY) / windowHalfY; //trop fort
        var vector = new THREE.Vector3(mouseX, mouseY, 0);
        vector.setLength(Math.min(vector.length(), 1.0)).multiplyScalar(max);

        var matrix = new THREE.Matrix4();
        matrix.makeRotationFromEuler(camera.rotation, camera.rotation.order);
        vector.applyMatrix4(matrix);

        camera.position.add(vector);

        camera.updateMatrixWorld(true);

        var cameraWorldPosition = new THREE.Vector3();
        camera.localToWorld(cameraWorldPosition);


        // Gates Anim;
        // /*
        for (var i = 0; i < gates.length; i++) {
            var gate = gates[i];
            gate.rotation.z += gate.rotationDirection * rotationSpeed * delta;

            var color = new THREE.Color();
            var elapsedTime = clock.getElapsedTime();
            color.setHSL(((elapsedTime % 4) / 4), 1, 0.5);
            gate.material.color = color;
            gate.material.ambient = color;

            gate.updateMatrixWorld(true);

            var colorTube = new THREE.Color();
            var elapsedTimeTube = clock.getElapsedTime();
            colorTube.setHSL(((elapsedTimeTube % 12) / 12), 1, 0.5);
            //gate.material.color = colorTube;
            tubeMaterial.ambient = colorTube;


            var childObj = gate.children[0];
            var cameraLocalPosition = cameraWorldPosition.clone();
            childObj.worldToLocal(cameraLocalPosition);

            if (childObj.geometry.boundingBox.containsPoint(cameraLocalPosition) && childObj.didCollide === false) {
                console.log('collide red: you dead');
                childObj.didCollide = true;
                stop();
                continue;
            }
            else {
                childObj.didCollide = false;
            }

            childObj = gate.children[1];
            cameraLocalPosition.copy(cameraWorldPosition);
            childObj.worldToLocal(cameraLocalPosition);

            if (childObj.geometry.boundingBox.containsPoint(cameraLocalPosition) && childObj.didCollide === false) {
                console.log('collide green: nice');
                childObj.didCollide = true;

                // Increase score
                intScore +=1;
                score.innerHTML = '<p>' + intScore + '</p>';

                // Increase speed
                if ((intScore % 10 )== 0) {
                    playSound(sounds[1]);
                    looptime = Math.max(looptime * 0.8, 5000);
                }
            }
            else {
                childObj.didCollide = false;
            }
        }

        renderer.render(scene, camera);

        if (isRunning) {
            window.requestAnimationFrame(render);
        }
    }

    function stop() {
        audio.pause();
        music.pause();
        playSound(sounds[2]);
        isRunning = false;
        $('#containerMainMenu').show();
        $('#container').hide();
    }

    function start() {
        playMusic();
        clock = new THREE.Clock();
        t = 0.1;
        looptime = 25 * 1000;
        isRunning = true;
        intScore = 0;
        $('#containerMainMenu').hide();
        $('#container').show();
        render();
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    mainMenuInit();
    init();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
});
