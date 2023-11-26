import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";

/************
 * SCENE
 ***********/
const scene = new THREE.Scene();

/************
 * OBJECTS
 ***********/
const group = new THREE.Group();
group.scale.y = 5;
group.rotation.y = 0.2;
scene.add(group);

const circle1 = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
circle1.position.x = -5;
group.add(circle1);

const circle2 = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
circle2.position.x = 0;
group.add(circle2);

scene.add(circle1, circle2);

/************
 * RAYCASTER
 * two parameters of a ray are ORIGIN and DIRECTION
 ***********/
const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
rayDirection.normalize();

raycaster.set(rayOrigin, rayDirection);

circle1.updateMatrixWorld();
circle2.updateMatrixWorld();

const intersect = raycaster.intersectObject(circle2);
console.log(intersect);

const intersects = raycaster.intersectObjects([circle1, circle2]);
console.log(intersects);

/************
 * SIZES
 ***********/
const sizes = {
  width: 1000,
  height: 800,
};

/************
 * CAMERA
 ***********/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
scene.add(camera);

/************
 * CANVAS
 ***********/
const canvas = document.querySelector("canvas.webgl");

/************
 * RENDERER
 ***********/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
const clock = new THREE.Clock();

// /************
//  * MOUSE
//  ***********/
// const mouse = new THREE.Vector2();

// window.addEventListener("mousemove", (event) => {
//   mouse.x = (event.clientX / sizes.width) * 2 - 1;
//   mouse.y = -(event.clientY / sizes.height) * 2 + 1;
// });

// console.log(mouse);

// let currentIntersect = null;

// window.addEventListener("click", () => {
//   if (currentIntersect) {
//     switch (currentIntersect.object) {
//       case circle1:
//         console.log("click on circle 1");
//         break;

//       case circle2:
//         console.log("click on circle 2");
//         break;
//     }
//   } 
// });



// /************
//  * CLICK EVENT
//  ***********/
// window.addEventListener("click", () => {
//   if (currentIntersect) {
//     console.log("click on object", currentIntersect.object); // Debugging
//     switch (currentIntersect.object) {
//       case circle1:
//         console.log("click on circle 1");
//         break;
//       case circle2:
//         console.log("click on circle 2");
//         break;
//     }
//   }
// });

/************
 * Check Collision
 ***********/
let score = 0;
let collisionDetected = false;

function checkCollision() {
  const distance = circle1.position.distanceTo(circle2.position);
  const sumOfRadii = 2; // Omda ze allebei radius 1 hebben

  if (distance <= sumOfRadii && !collisionDetected) {
    collisionDetected = true;
    console.log("Circles are touching");
    score++;
    localStorage.setItem(score, score);
    const scoreElement = document.getElementById("punten");
    if (scoreElement) {
      scoreElement.innerHTML = score;
    } else {
      console.log("Element with ID 'punten' not found");
    }

    //Cirkels weer op hun plaats zetten na collision
    circle1.position.x = -5;
    circle2.position.x = 0;
  } else if (distance > sumOfRadii) {
    collisionDetected = false;
  }
}

/************
 * TICK
 ***********/
const tick = () => {
  // Raycaster
  // raycaster.setFromCamera(mouse, camera);
  // const intersects = raycaster.intersectObjects([circle1, circle2]);

  // // if (intersects.length) {
  // //   if (!currentIntersect) {
  // //     console.log("mouse enter", intersects[0].object); // Debugging
  // //   }
  // //   currentIntersect = intersects[0];
  // // } else {
  // //   if (currentIntersect) {
  // //     console.log("mouse leave"); // Debugging
  // //   }
  // //   currentIntersect = null;
  // // }

  // // // Change color
  // // for (const intersect of intersects) {
  // //   intersect.object.material.color.set("#0000ff");
  // // }

  // // for (const object of [circle1, circle2]) {
  // //   if (!intersects.find((intersect) => intersect.object === object)) {
  // //     object.material.color.set("#ff0000");
  // //   }
  // // }

  checkCollision();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};

tick();

/************
 * DRAG CONTROLS
 ***********/
const controls = new DragControls(
  [circle1, circle2],
  camera,
  renderer.domElement
);

controls.addEventListener("dragstart", function (event) {
  // Disable orbit controls wnr je aan het slepen bent
});

controls.addEventListener("dragend", function (event) {
  // Re-enable orbit controls wnr je bent gestopt
});

renderer.render(scene, camera);
console.log("JavaScript is working");
