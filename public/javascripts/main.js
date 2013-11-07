$(function() {
    'use strict';

    /* global THREE: false */

    var clock = new THREE.Clock();

    var container;

    var isRunning = false;

    var scene, renderer, camera, intScore = 0;

    var score = document.createElement('div');

    $( "#btnStart" ).click(function() {
        start();
    });

    $( "#btnReStart" ).click(function() {
        start();
    });

    $( "#btnMainMenu" ).click(function() {
        switchEndToMain();
    });

    $( "#btnswitchMainToLeaders" ).click(function() {
        switchMainToLeaders();
    });

    $( "#btnMainMenu0" ).click(function() {
        switchLeadersToMain();
    });

    $( "#btnswitchEndToLeaders" ).click(function() {
        switchEndToLeaders();
    });
    $( "#containerEndMenu").hide();
    $( "#leaderboardsMenu").hide();
    $('#submitResponse').hide();

    var parent;
    var tube;
    var scale = 20;

    // Rotate a gate 1/4 par second
    var rotationSpeed = ((2.0 * Math.PI) / 4.0) / 1000;

    // Do a loop in 15 s
    var looptime;

    var t = 0.0;

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
        var MAX_GATES = 20;

        var demiCircleGeometry = new THREE.CircleGeometry(4, 80, 0, Math.PI);
        var demiCircleMaterial = new THREE.MeshLambertMaterial({
            ambient: 0xFFFFFF,
            color: 0x0000FF,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            opacity: 0.8,
            combine: THREE.MixOperation
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


    function init() {
        t = 0;
        isRunning = true;

        container = document.createElement('div');
        container.setAttribute('id', 'container');
        container.style.zIndex = 0;
        document.body.appendChild(container);
        score.setAttribute('id', 'score');
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
            tubeMaterial.ambient = colorTube;


            var childObj = gate.children[0];
            var cameraLocalPosition = cameraWorldPosition.clone();
            childObj.worldToLocal(cameraLocalPosition);

            if (clock.getElapsedTime() > 1.0 &&
                childObj.geometry.boundingBox.containsPoint(cameraLocalPosition)&&
                childObj.didCollide === false) {
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

            if (clock.getElapsedTime() > 1.0 &&
                childObj.geometry.boundingBox.containsPoint(cameraLocalPosition) &&
                childObj.didCollide === false) {
                console.log('collide green: nice');
                childObj.didCollide = true;

                // Increase score
                intScore +=1;
                score.innerHTML = '<p>' + intScore + '</p>';
                score.value=intScore;

                // Increase speed
                if ((intScore % 10 )== 0) {
                    playSound(sounds[1]);
                    looptime = Math.max(looptime * 0.9, 5000);
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
        $('#publish0').show();
        $('#submitResponse').hide();
        $('canvas').hide();
        $('header').show();
        $('#containerEndMenu').show();
        fetchClosestScore(intScore, successFetchClosestScoreCbk, failureFetchClosestScoreCbk);
        $('#container').hide();
    }

    function start() {
        $('canvas').show();
        $( "#closestScore1" ).empty();
        $( "#closestScore2" ).empty();
        $( "#YouAreHere" ).empty();
        $('header').hide();
        playMusic();
        clock = new THREE.Clock();
        t = 0.0;
        looptime = 20 * 1000;
        isRunning = true;
        intScore = 0;
        $('#containerMainMenu').hide();
        $('#containerEndMenu').hide();
        $('#container').show();
        render();
    }

    function switchEndToMain(){
        $('#containerEndMenu').hide();
        $( "#closestScore1" ).empty();
        $( "#closestScore2" ).empty();
        $( "#YouAreHere" ).empty();
        $('#containerMainMenu').show();
    }
    function switchMainToLeaders(){
        $('#containerMainMenu').hide();
        $('#leaderboardsMenu').show();
        fetchSTopScore(successFetchLeadersScoreCbk, failureFetchClosestScoreCbk);
    }
    function switchLeadersToMain(){
        $('#leaderboardsMenu').hide();
        $( "#leader" ).empty();
        $('#containerMainMenu').show();
    }
    function switchEndToLeaders(){
        $( "#closestScore1" ).empty();
        $( "#closestScore2" ).empty();
        $( "#YouAreHere" ).empty();
        $('#containerEndMenu').hide();
        $('#leaderboardsMenu').show();
        fetchSTopScore(successFetchLeadersScoreCbk, failureFetchClosestScoreCbk);
    }
    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }

    $('#containerMainMenu').show();
    init();

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    $('#publish').click(function(e) {
        var pseudo = $('#addname').val(),
            score = $('#score').val();
        setScore(pseudo, score, successTfCbk, failureTfCbk);
        e.preventDefault();
    });
});
