document.addEventListener('DOMContentLoaded', () => {
    // Referencias Oficina
    const flashlight = document.getElementById('flashlight');
    const environment = document.getElementById('environment');
    const bgImage = document.getElementById('bg-image');
    const fadeOverlay = document.getElementById('fade-overlay');
    const clock = document.getElementById('clock');
    
    // Referencias Cámaras
    const monitorBar = document.getElementById('monitor-bar');
    const cameraSystem = document.getElementById('camera-system');
    const camBg = document.getElementById('cam-bg');
    const camBtns = document.querySelectorAll('.cam-btn');
    const camStaticFlash = document.getElementById('cam-static-flash');
    
    const winScreen = document.getElementById('win-screen');
    const winText = document.getElementById('win-text');

    // Intro sequence
    setTimeout(() => {
        fadeOverlay.classList.remove('active');
        setTimeout(() => {
            fadeOverlay.innerHTML = '';
        }, 300);
    }, 2000);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Sistema de Escenas (Oficina)
    const SCENES = {
        LEFT: 'window_alone.png',
        CENTER: 'office_alone.jpg',
        RIGHT: 'armario_alone.png'
    };
    
    // Directorio y archivos de Cámaras
    const CAMERAS = {
        living: 'Camera/living_monge.png',
        comedor: 'Camera/comedor_monge.jpg',
        cocina: 'Camera/cocina_monge.png',
        banio: 'Camera/banio_alone.jpg',
        exterior: 'Camera/exterior_monge.jpg'
    };
    
    let currentScene = 'CENTER';
    let isTransitioning = false;
    let isMonitorUp = false; // ESTADO DEL MONITOR
    let canClick = false;
    let nextSceneTarget = null;

    // Sistema de Tiempo
    let currentHour = 0; 
    let gameActive = true;
    const millisecondsPerHour = 60000; 
    
    const timerInterval = setInterval(() => {
        if (!gameActive) return;
        currentHour++;
        if (currentHour < 6) {
            clock.innerText = `${currentHour} AM`;
        } else {
            triggerWin();
        }
    }, millisecondsPerHour);

    function triggerWin() {
        gameActive = false;
        clearInterval(timerInterval);
        if (isMonitorUp) {
            cameraSystem.classList.remove('active');
            isMonitorUp = false;
        }
        winScreen.classList.add('active');
        setTimeout(() => {
            winText.innerText = "6:00 AM";
        }, 2000);
    }

    // --- LÓGICA DEL MONITOR DE CÁMARAS ---
    monitorBar.addEventListener('mouseenter', () => {
        if (!gameActive || isTransitioning) return;
        
        isMonitorUp = !isMonitorUp;
        
        if (isMonitorUp) {
            cameraSystem.classList.add('active');
            document.body.classList.remove('can-click');
        } else {
            cameraSystem.classList.remove('active');
            // Re-evaluar zonas al bajar la cámara
            checkInteractionZones(targetX); 
        }
    });

    camBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('active')) return;

            // Actualizar botón activo
            camBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Flash de estática
            camStaticFlash.classList.add('flash');
            
            const camKey = e.target.getAttribute('data-cam');
            
            setTimeout(() => {
                camBg.style.backgroundImage = `url('${CAMERAS[camKey]}')`;
                currentX = window.innerWidth / 2;
                camBg.style.transform = `translateX(0px)`;
                camStaticFlash.classList.remove('flash');
            }, 150); // Tiempo que dura el pantallazo blanco de estática
        });
    });


    // --- TRACKING DEL MOUSE (Actualizado) ---
    document.addEventListener('mousemove', (e) => {
        if (!gameActive || isTransitioning) return;
        targetX = e.clientX;
        targetY = e.clientY;

        if (!isMonitorUp) {
            checkInteractionZones(targetX);
        }
    });

    document.addEventListener('click', () => {
        if (canClick && nextSceneTarget && !isTransitioning && gameActive && !isMonitorUp) {
            switchScene(nextSceneTarget);
        }
    });

    function checkInteractionZones(mouseX) {
        if (isMonitorUp) return; // No calcular si vemos las cámaras

        const screenWidth = window.innerWidth;
        const leftThreshold = screenWidth * 0.20; 
        const rightThreshold = screenWidth * 0.80; 

        canClick = false;
        nextSceneTarget = null;
        document.body.classList.remove('can-click');

        if (currentScene === 'CENTER') {
            if (mouseX <= leftThreshold) {
                canClick = true; nextSceneTarget = 'LEFT';
            } else if (mouseX >= rightThreshold) {
                canClick = true; nextSceneTarget = 'RIGHT';
            }
        } else if (currentScene === 'LEFT') {
            if (mouseX >= rightThreshold) {
                canClick = true; nextSceneTarget = 'CENTER';
            }
        } else if (currentScene === 'RIGHT') {
            if (mouseX <= leftThreshold) {
                canClick = true; nextSceneTarget = 'CENTER';
            }
        }

        if (canClick) { document.body.classList.add('can-click'); }
    }

    function switchScene(targetScene) {
        isTransitioning = true;
        document.body.classList.remove('can-click'); 

        fadeOverlay.classList.add('active');

        setTimeout(() => {
            currentScene = targetScene;
            bgImage.style.backgroundImage = `url('${SCENES[targetScene]}')`;
            
            targetX = window.innerWidth / 2;
            targetY = window.innerHeight / 2;
            currentX = targetX;
            currentY = targetY;
            
            fadeOverlay.classList.remove('active');
            
            setTimeout(() => {
                isTransitioning = false;
                checkInteractionZones(targetX);
            }, 300);
            
        }, 300); 
    }

    // Bucle principal
    function animate() {
        if (!gameActive) return;

        if (!isMonitorUp) {
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;

            flashlight.style.setProperty('--x', `${currentX}px`);
            flashlight.style.setProperty('--y', `${currentY}px`);

            const moveX = (currentX / window.innerWidth - 0.5) * 2;
            const moveY = (currentY / window.innerHeight - 0.5) * 2;
            const parallaxStrength = 20;
            environment.style.transform = `translate(${moveX * -parallaxStrength}px, ${moveY * -parallaxStrength}px)`;

            if (Math.random() > 0.95) {
                const randomOpacity = 0.85 + Math.random() * 0.15;
                flashlight.style.setProperty('--flicker', randomOpacity);
                const randomSize = 490 + Math.random() * 20;
                flashlight.style.setProperty('--size', `${randomSize}px`);
            } else {
                flashlight.style.setProperty('--size', `500px`);
                flashlight.style.setProperty('--flicker', `0.95`);
            }
       } 
        // Lógica de Panning de Cámaras (cuando el monitor está ARRIBA)
        else {
            // 1. Lerp lento en AMBOS ejes para la sensación de peso mecánico
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;

            // 2. Convertimos la posición actual a un porcentaje (de 0% a 100%)
            const percentX = (currentX / window.innerWidth) * 100;
            const percentY = (currentY / window.innerHeight) * 100;
            
            // 3. Movemos el INTERIOR de la imagen (background-position)
            // Si el mouse está arriba del todo (0%), muestra el tope absoluto de la foto.
            camBg.style.backgroundPosition = `${percentX}% ${percentY}%`;
        }

        requestAnimationFrame(animate);
    }

    animate();
});