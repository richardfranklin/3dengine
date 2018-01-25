(function () {
    'use strict';

    var width_variable = {
        width: () => {
            if (document.documentElement.clientWidth < window.innerWidth) {
                return windowWidth = window.innerWidth;
            }
            else {
                /* options below due to IE8 fix */
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            };
        },
        height: () => {
            if (document.documentElement.clientHeight < window.innerHeight) {
                return windowHeight = window.innerHeight;
            }
            else {
                /* options below due to IE8 fix */
                return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            };
        }

    };

    var windowWidth = width_variable.width(),
        windowHeight = width_variable.height();


    // MAIN

    // standard global variables
    var container, scene, camera, renderer, controls;
    var clock = new THREE.Clock();
    // custom global variables
    var cube;

    var raycaster, mouse, INTERSECTED;

    function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = (event.clientX / windowWidth) * 2 - 1;
        mouse.y = - (event.clientY / windowHeight) * 2 + 1;
    }

    init();
    animate();

    // FUNCTIONS 		
    function init() {

        // SCENE
        scene = new THREE.Scene();

        // CAMERA
        var SCREEN_WIDTH = windowWidth, SCREEN_HEIGHT = windowHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(0, 50, 140);
        camera.lookAt(scene.position);

        // RENDERER
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);

        // CONTROLS
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI / 2;
        controls.minDistance = 95;
        controls.maxDistance = 180;

        // LIGHT
        var light = new THREE.PointLight(0xffffff, 0.85);
        light.position.set(0, 100, 0);
        scene.add(light);

        // FLOOR
        var floorTexture = new THREE.MeshLambertMaterial({ color: 'red', side: THREE.DoubleSide })
        var floorGeometry = new THREE.CircleBufferGeometry(100, 32);

        var floor = new THREE.Mesh(floorGeometry, floorTexture);
        floor.position.y = -34;
        floor.rotation.x = Math.PI / 2;
        floor.rotation.z = Math.PI / 4;
        // scene.add(floor);

        // ========================
        // Point Marker
        // ========================
        var pointGeometry = new THREE.SphereGeometry(2, 32, 32);
        var pointTexture = new THREE.MeshLambertMaterial({ color: 'red', side: THREE.DoubleSide });

        var point = new THREE.Mesh(pointGeometry, pointTexture);
        point.position.x = 22;
        point.position.z = -10;

        scene.add(point);


        // ========================
        // ENGINE MODEL
        // ========================

        // instantiate a loader
        var loader = new THREE.OBJLoader();
        // load a resource
        loader.load(
            '/models/engine.obj',
            // called when resource is loaded
            function (object) {
                scene.add(object);
            },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
            }
        );

        // ========================
        // STAND MODEL
        // ========================
        var loaderStand = new THREE.OBJLoader();
        // load a resource
        loaderStand.load(
            '/models/table.obj',
            // called when resource is loaded
            function (object) {
                object.scale.set(1.6, 1.6, 1.6);
                object.position.y = -150;
                scene.add(object);
            },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
            }
        );

        // ========================
        // Raycaster
        // ========================

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        ////////////
        // CUSTOM //
        ////////////

        // var imagePrefix = "/img/dawnmountain-";
        // var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        // var imageSuffix = ".png";
        // var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

        // var materialArray = [];
        // for (var i = 0; i < 6; i++)
        //     materialArray.push(new THREE.MeshBasicMaterial({
        //         map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
        //         side: THREE.BackSide
        //     }));

        var backgroundGeometry = new THREE.SphereGeometry(500, 32, 32);

        var backgroundTexture = new THREE.TextureLoader().load("/img/pano-sphere-3.jpg");

        var backgroundMaterial = new THREE.MeshBasicMaterial({
            map: backgroundTexture,
            side: THREE.DoubleSide
        });

        //var backgroundMaterial = new THREE.MeshLambertMaterial({ color : 'red', side: THREE.DoubleSide });

        var skyBox = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        scene.add(skyBox);

    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        update();
    }

    function update() {
        controls.update();
    }

    function render() {

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children);

        // for ( var i = 0; i < intersects.length; i++ ) {
        //     intersects[ i ].object.material.color.set( 0x0066ff );
        // }

        // var intersects = raycaster.intersectObjects(scene.children);
        // if (intersects.length > 0) {

        //     if (INTERSECTED != intersects[0].object) {
        //     if (INTERSECTED) INTERSECTED.setHex(0X000000);
        //         INTERSECTED = intersects[0].object;
        //         INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        //         INTERSECTED.material.emissive.setHex(0xff0000);
        //     }
        // } else {
        //     if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        //     INTERSECTED = null;
        // }


        // RENDER
        renderer.render(scene, camera);
    }

    window.addEventListener('mousemove', onMouseMove, false);
    window.requestAnimationFrame(render);



})();