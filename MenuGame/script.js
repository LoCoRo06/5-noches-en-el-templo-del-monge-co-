document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.option');
    let currentIndex = 0;

    // Función para actualizar visualmente la opción seleccionada
    function updateSelection(newIndex) {
        // Remover estado activo de la opción actual
        options[currentIndex].classList.remove('active');
        options[currentIndex].querySelector('.cursor').classList.add('hidden');

        // Actualizar el índice
        currentIndex = newIndex;

        // Añadir estado activo a la nueva opción
        options[currentIndex].classList.add('active');
        options[currentIndex].querySelector('.cursor').classList.remove('hidden');
    }

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            let newIndex = currentIndex + 1;
            if (newIndex >= options.length) newIndex = 0; // Vuelve al inicio
            updateSelection(newIndex);
        } 
        else if (e.key === 'ArrowUp') {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = options.length - 1; // Va al final
            updateSelection(newIndex);
        }
        else if (e.key === 'Enter') {
            // Acá podrías disparar la acción de ir al juego
            const selectedOption = options[currentIndex].dataset.index;
            if (selectedOption === '1') {
                window.location.href = '../First_Night/index.html';
            }
            console.log(`Seleccionaste: ${options[currentIndex].innerText.replace('>>', '').trim()}`);
        }
    });

    // Soporte para Hover con el mouse (para que teclado y mouse no se peleen)
    options.forEach((option, index) => {
        option.addEventListener('mouseenter', () => {
            if (currentIndex !== index) {
                updateSelection(index);
            }
        });
        
        option.addEventListener('click', () => {
            const selectedOption = option.dataset.index;
            if (selectedOption === '1') {
                window.location.href = '../First_Night/index.html';
            }
            console.log(`Clickeaste: ${option.innerText.replace('>>', '').trim()}`);
        });
    });
});