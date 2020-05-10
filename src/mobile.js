require('./styles.less');
import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {BleachBypassShader} from 'three/examples/jsm/shaders/BleachBypassShader.js';
import {CopyShader} from 'three/examples/jsm/shaders/CopyShader.js';
import {BloomPass} from 'three/examples/jsm/postprocessing/BloomPass.js';
import {DDSLoader} from 'three/examples/jsm/loaders/DDSLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';

const $ = require('jquery');

class MusicApp {
    constructor(trackList, audioLoader, sound) {
        this.trackList = trackList;
        this.audioLoader = audioLoader;
        this.sound = sound;
        this.initAudio();
        this.initUI();
        this.loadAudio();
    }

    initUI() {
        let self = this;

        var $track_container_onInit = $('#info');
         self.trackList.forEach(function(track) {
            $track_container_onInit.append('<div class="song-title">'+ track.trackNumber + '. ' + track.name +'</div>');
        });

        this.controls = {
            prev: document.querySelector('#back'),
            next: document.querySelector('#forward'),
            play: document.querySelector('#play'),
            pause: document.querySelector('#pause'),
        };

        this.controls.prev.onclick = () => {
            $($(".song-title")[self.currentSong]).removeClass("active");
            self.currentSong = self.currentSong > 0 ? self.currentSong - 1 : self.trackList.length - 1;
            $($(".song-title")[self.currentSong]).addClass("active");
            self.sound.stop();
            self.audioLoader.load( self.trackList[self.currentSong].url, function( buffer ) {
                self.sound.setBuffer( buffer );
                self.sound.play();
            });
        };
        this.controls.next.onclick = () => {
            $($(".song-title")[self.currentSong]).removeClass("active");
            self.currentSong = self.currentSong < self.trackList.length - 1 ? self.currentSong + 1 : 0;
            $($(".song-title")[self.currentSong]).addClass("active");
            self.sound.stop();
            self.audioLoader.load( self.trackList[self.currentSong].url, function( buffer ) {
                self.sound.setBuffer( buffer );
                self.sound.play();
            });
        };

        this.controls.play.onclick = () => {
                self.sound.play();
                self.playing = true;
                $(self.controls.play).css('display','none');
                $(self.controls.pause).css('display','block');
        };
        this.controls.pause.onclick = () => {
                self.sound.pause();
                self.playing = false;
                $(self.controls.play).css('display','block');
                $(self.controls.pause).css('display','none');
                
        };

        $($(".song-title")[this.currentSong]).addClass("active");
    }

    initAudio() {
        let self = this;
        this.currentSong = 0;

        this.sound.onEnded = () => {
            $($(".song-title")[self.currentSong]).removeClass("active");
            self.currentSong = self.currentSong < self.trackList.length - 1 ? self.currentSong + 1 : 0;
            $($(".song-title")[self.currentSong]).addClass("active");
            self.sound.pause();
            self.audioLoader.load( self.trackList[self.currentSong].url, function( buffer ) {
                self.sound.setBuffer( buffer );
                self.sound.play();
            });
        };

        self.audioLoader.load( self.trackList[self.currentSong].url, function( buffer ) {
            self.sound.setBuffer( buffer );
            self.sound.play();
        });

    }

    loadAudio() {

        let self = this;

        if (self.playing && self.audioReady) {
            self.sound.pause();
        }

        this.audioReady = false;
        this.playing = true;
    }
}

var container;

var effectBloom;
var camera, scene, renderer;

var composer, controls;

var object1, object2, object3, object4;

// var mouseX = 0;
// var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var light1, light2, light3, light4, light5, light6, light7, light8;
var object_array = [];

//Load Everything
var manager = new THREE.LoadingManager();

manager.onLoad = function(){
    $.ajax({
        url: "https://evandelia.com/blackbird/tracks.json",
        dataType: "json",
        success: function (response) {
            document.getElementById('startButton').innerHTML = 'Click to Play';
            document.getElementById('startButton').onclick = () => {
                init(response.tracks);
                animate();
                // AudioHandler.init();
                // AudioHandler.loadAudioElement;
            }
        },
        error: function (response) {
            console.log(response);
            $("#info").html("Error Loading");
        }
    });
}

var loader1 = new OBJLoader( manager );
manager.addHandler( /\.dds$/i, new DDSLoader() );
                var mtlLoader = new MTLLoader(manager);
                mtlLoader.setPath( 'https://evandelia.com/blackbird/media/Roses/' );
                mtlLoader.load( 'rose.mtl', function( materials ) {
                    materials.preload();
                    loader1.setMaterials( materials );
                    loader1.setPath( 'https://evandelia.com/blackbird/media/Roses/' );
                    loader1.load( 'rose.obj', function ( object ) {
                        object1 = object;
                        mtlLoader.setPath( 'https://evandelia.com/blackbird/media/flowers/' );
                        mtlLoader.load( 'Vase.mtl', function( materials ) {
                            materials.preload();
                            loader1.setMaterials( materials );
                            loader1.setPath( 'https://evandelia.com/blackbird/media/flowers/' );
                            loader1.load( 'Vase.obj', function ( object ) {
                                object2 = object;
                                // mtlLoader.setPath( 'https://evandelia.com/blackbird/media/flowers/' );
                                // mtlLoader.load( 'Flower vase.mtl', function( materials ) {
                                //     materials.preload();
                                //     loader1.setMaterials( materials );
                                //     loader1.setPath( 'https://evandelia.com/blackbird/media/flowers/' );
                                //     loader1.load( 'Flower vase.obj', function ( object ) {
                                //         object3 = object;
                                //     } );
                                // });
                            } );
                        });
                    } );
                });
                loader1.setPath( 'https://evandelia.com/blackbird/media/flowers/' );
                loader1.load( 'lotus.obj', function ( object ) {
                    object4 = object;
                } );



function init(tracks) {
    $('#overlay').hide();
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;

    scene = new THREE.Scene();
    var texture = new THREE.CubeTextureLoader() //cube texture of space
                    .setPath( 'https://evandelia.com/blackbird/media/cube/Park2/' )
                    .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    scene.background = texture;

    // Lights
    var intensity = 2.5;
    var distance = 6000;
    var decay = 7.5;
    var c1 = 0x2E7D32, c2 = 0x00B0FF, c3 = 0x303F9F, c4 = 0xF4511E, c5 = 0x4DB6AC, c6 = 0x33691E, c7 = 0x7986CB, c8 = 0xFFEA00;
    // var sphere = new THREE.SphereGeometry( 5.25, 16, 8 );
    light1 = new THREE.PointLight( c1, intensity, distance, decay );
    // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
    scene.add( light1 );
    light2 = new THREE.PointLight( c2, intensity, distance, decay );
    // light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
    scene.add( light2 );
    light3 = new THREE.PointLight( c3, intensity, distance, decay );
    // light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
    scene.add( light3 );
    light4 = new THREE.PointLight( c4, intensity, distance, decay );
    // light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
    scene.add( light4 );
    light5 = new THREE.PointLight( c5, intensity, distance, decay );
    scene.add( light5 );
    light6 = new THREE.PointLight( c6, intensity, distance, decay );
    scene.add( light6 );
    light7 = new THREE.PointLight( c7, intensity, distance, decay );
    scene.add( light7 );
    light8 = new THREE.PointLight( c8, intensity, distance, decay );
    scene.add( light8 );

    //ambient light
    var ambient = new THREE.AmbientLight( 0xffaaaa, 0.15 );
    scene.add( ambient );

    //renderer
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //set orbit controls
    controls = new DeviceOrientationControls( camera );

    var tempMesh;
    for (var i = 0; i < 5; i++) {
        tempMesh = object1.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random() * 4 + 1;
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }
    for (var i = 0; i < 5; i++) {
        tempMesh = object2.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random();
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }
    // for (var i = 0; i < 5; i++) {
    //     tempMesh = object3.clone();
    //     tempMesh.position.x = Math.random() * 3000 - 1500;
    //     tempMesh.position.y = Math.random() * 4000 - 2000;
    //     tempMesh.position.z = Math.random() * 3000 - 1500;
    //     tempMesh.rotation.x = Math.random() * 2 * Math.PI;
    //     tempMesh.rotation.y = Math.random() * 2 * Math.PI;
    //     tempMesh.rotation.z = Math.random() * 2 * Math.PI;
    //     tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random() * 10;
    //     scene.add(tempMesh);
    //     object_array.push(tempMesh);
    // }
    for (var i = 0; i < 5; i++) {
        tempMesh = object4.clone();
        tempMesh.position.x = Math.random() * 3000 - 1500;
        tempMesh.position.y = Math.random() * 4000 - 2000;
        tempMesh.position.z = Math.random() * 3000 - 1500;
        tempMesh.rotation.x = Math.random() * 2 * Math.PI;
        tempMesh.rotation.y = Math.random() * 2 * Math.PI;
        tempMesh.rotation.z = Math.random() * 2 * Math.PI;
        tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = Math.random() * 10 + 6;
        scene.add(tempMesh);
        object_array.push(tempMesh);
    }

    // trails
    renderer.autoClearColor = false;

    // postprocessing effects
    var renderModel = new RenderPass( scene, camera );
    effectBloom = new BloomPass( 1.0, 10, 1.0, 2048); //needs to be a gloabal value so we can change it in the animate function
    var effectBleach = new ShaderPass( BleachBypassShader );
    var effectCopy = new ShaderPass( CopyShader );

    effectBleach.uniforms[ "opacity" ].value = 0.7;

    effectCopy.renderToScreen = true;

    composer = new EffectComposer( renderer );

    composer.addPass( renderModel );
    composer.addPass( effectBleach );
    composer.addPass( effectBloom );
    composer.addPass( effectCopy );

    window.addEventListener( 'resize', onWindowResize, false );

    var listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    var sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();

    new MusicApp(tracks, audioLoader, sound);

    window.analyzer = new THREE.AudioAnalyser( sound, 32 );
    // create an AudioAnalyser, passing in the sound and desired fftSize
    // get the average frequency of the sound
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.reset();

}

function animate() {
    requestAnimationFrame( animate );
    render();
    controls.update();
}

function render() {
    var volume = window.analyzer.getAverageFrequency() / 1000;
    var time = Date.now() * 0.00025;
    var d = 550;
    //change position of the lights based on volume and randomness
    light1.position.x = Math.sin( time * 1.7 ) * d * volume * 42;
    light4.position.z = Math.cos( time * 0.3 ) * d * volume * 64;
    light6.position.x = Math.cos( time * 0.3 ) * d * volume * 46;
    light6.position.z = Math.sin( time * 0.7 ) * d * volume * 63;
    light3.position.x = Math.sin( time * 0.7 ) * d * volume * 46;
    light3.position.z = Math.sin( time * 4.5 ) * d * volume * 66;
    light4.position.x = Math.sin( time * 0.3 ) * d * volume * 46;
    light4.position.z = Math.sin( time * 0.5 ) * d * volume * 66;
    light5.position.x = Math.cos( time * 0.3 ) * d * volume * 43;
    light5.position.z = Math.sin( time * 0.5 ) * d * volume * 67;
    light6.position.x = Math.cos( time * 0.7 ) * d * volume * 49;
    light6.position.z = Math.cos( time * 0.5 ) * d * volume * 66;
    light7.position.x = Math.cos( time * 0.7 ) * d * volume * 49;
    light7.position.z = Math.cos( time * 0.5 ) * d * volume * 66;
    light8.position.x = Math.cos( time * 0.7 ) * d * volume * 44;
    light8.position.z = Math.cos( time * 0.5 ) * d * volume * 64;
    camera.position.z = camera.position.z + (Math.cos( time / 4 * 0.7 ) ); //move camera slightly
    for (var i = 0; i < 15; i += 5){
        object_array[i].rotation.x += Math.PI * volume / 100; //rotate objects based on volume
    }
    effectBloom.copyUniforms[ "opacity" ].value = volume*5; //bloom effect based on volume
    controls.update();
    renderer.clear();
    composer.render();

}