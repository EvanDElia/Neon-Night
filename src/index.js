require('./styles.less');
import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import {ConvolutionShader} from 'three/examples/jsm/shaders/ConvolutionShader.js';
import {BleachBypassShader} from 'three/examples/jsm/shaders/BleachBypassShader.js';
import {CopyShader} from 'three/examples/jsm/shaders/CopyShader.js';
import {BloomPass} from 'three/examples/jsm/postprocessing/BloomPass.js';
import {DDSLoader} from 'three/examples/jsm/loaders/DDSLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const $ = require('jquery');

class MusicApp {
    constructor(trackList, audioLoader, sound) {
        this.trackList = trackList;
        this.audioLoader = audioLoader;
        this.sound = sound;
        this.initAudio();
        this.initUI();
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

        self.audioLoader.load( self.trackList[self.currentSong].url, function( buffer ) {
            self.sound.setBuffer( buffer );
            self.sound.play();
        });

        this.sound.onEnded = () => {
            $($(".song-title")[self.currentSong]).removeClass("active");
            self.currentSong = self.currentSong < self.trackList.length - 1 ? self.currentSong + 1 : 0;
            $($(".song-title")[self.currentSong]).addClass("active");
            self.sound.stop();
            self.audioLoader.load( self.trackList[self.currentSong].url, function( buffer ) {
                self.sound.setBuffer( buffer );
                self.sound.play();
            });
        };
    }
}

function trackCounter(secs) {
    var min = Math.floor((secs % 3600) / 60);
    var sec = Math.floor(secs % 60);
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ':' + sec;
}
var mobilecheck = function() {
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) window.location.href = "mobile.html";})(navigator.userAgent||navigator.vendor||window.opera);
}();
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
var backgrounds = [], background_index = 0;

//Load Everything
var manager = new THREE.LoadingManager();
// var player = document.getElementById('audioElem');
// player.addEventListener("timeupdate", function() {
//     var currentTime = player.currentTime;
//     var duration = player.duration;
//     $('#progress').css('width', (currentTime / duration * 100.00)+ '%');
// });

manager.onLoad = function(){
    //first two black screens start fading out once all objects are loaded
    // $("#text1").addClass("fadeOut");
    // $(".fadeOut").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
    //     $("#text1").css("display", "none");
    //     $("#text2").css("display", "block");
    //     $("#text2").addClass("fadeIn");
    //     $(".fadeOut").unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd");
    //     $(".fadeIn").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
    //         $("#black").addClass("fadeOut");
    //         $("#text2").addClass("fadeOut");
    //         $("#text2").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
    //             $("#black").css("display", "none");
    //             $("#text2").css("display", "none");
    //         });
    //     });
    // });
    //document.getElementById("audioElem").play();
    $.ajax({
        url: "https://evandelia.com/blackbird/tracks.json",
        dataType: "json",
        success: function (response) {
            document.getElementById('startButton').innerHTML = 'Click to Play';
            document.getElementById('startButton').onclick = () => {
                init(response.tracks);
                animate();
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
    var texture1 = new THREE.CubeTextureLoader() //cube texture of china
                    .setPath( 'https://evandelia.com/blackbird/media/cube/' )
                    .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    var texture2 = new THREE.CubeTextureLoader() //cube texture of park
                    .setPath( 'https://evandelia.com/blackbird/media/cube/Park2/' )
                    .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    var texture3 = new THREE.CubeTextureLoader() //cube texture of space
                    .setPath( 'https://evandelia.com/blackbird/media/cube/MilkyWay/' )
                    .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    backgrounds.push(texture1, texture2, texture3);
    background_index = 0;

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
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;

    var tempMesh;
    for (var i = 0; i < 50; i++) {
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
    for (var i = 0; i < 50; i++) {
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
    // for (var i = 0; i < 50; i++) {
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
    for (var i = 0; i < 50; i++) {
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

//function for changing the background
function change(){
    if (background_index > backgrounds.length){
        background_index = 0;
    }
    scene.background = backgrounds[background_index];
    background_index++;
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
}

function render() {

    if (Date.now()%120 === 0) change();
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
    for (var i = 0; i < 150; i += 5){
        object_array[i].rotation.x += Math.PI * volume / 100; //rotate objects based on volume
    }
    effectBloom.copyUniforms[ "opacity" ].value = volume*5; //bloom effect based on volume
    controls.update();
    renderer.clear();
    composer.render();

}