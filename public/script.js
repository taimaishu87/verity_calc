document.getElementById('callout').addEventListener('input', function() {
    const callout = this.value.toLowerCase();
    const validCallouts = ['tsc', 'tcs', 'stc', 'sct', 'cst', 'cts'];
    const shapesContainer = document.getElementById('shapes-container');
    const targetSolutionContainer = document.getElementById('target-solution-container');
    const targetSolution = document.getElementById('target-solution');
    
    shapesContainer.innerHTML = ''; // Clear previous shapes
    targetSolution.innerHTML = ''; // Clear previous target solution

    if (callout.length === 3 && validCallouts.includes(callout)) {
        this.classList.remove('error');
        const shapeMap = {
            't': 'triangle.png',
            's': 'square-full.svg',
            'c': 'circle.png'
        };

        const solutionMap = {
            't': 'Cylinder',
            's': 'Cone',
            'c': 'Prism'
        };

        // Display the shapes
        for (let char of callout) {
            const img = document.createElement('img');
            img.src = shapeMap[char];
            img.style.width = '100px';
            img.style.height = '100px';
            shapesContainer.appendChild(img);
        }

        // Display the targeted solution
        for (let char of callout) {
            const btn = document.createElement('div');
            btn.className = 'target-solution-btn';
            btn.textContent = solutionMap[char];
            targetSolution.appendChild(btn);
        }

        targetSolutionContainer.style.display = 'block';
    } else {
        targetSolutionContainer.style.display = 'none';
        if (callout.length === 3) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    }
});

const selectedShapes = {
    statue1: null,
    statue2: null,
    statue3: null
};

document.querySelectorAll('.shape-btn').forEach(button => {
    button.addEventListener('click', function() {
        const parent = this.parentElement.id;
        const shape = this.dataset.shape;
        selectedShapes[parent] = shape;

        // Highlight the selected button
        Array.from(this.parentElement.children).forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

document.getElementById('submit').addEventListener('click', function() {
    const callout = document.getElementById('callout').value.toLowerCase();

    fetch('/get-solution', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            callout: callout,
            statues: [selectedShapes.statue1, selectedShapes.statue2, selectedShapes.statue3]
        })
    })
    .then(response => response.json())
    .then(data => {
        const solutionContainer = document.getElementById('solution-container');
        if (data.solution) {
            const formattedSolution = data.solution
                .replace(/(Square|Circle|Triangle)/g, '<b>$1</b>')
                .replace(/(Statue \d)/g, '<b>$1</b>');

            solutionContainer.innerHTML = `<div class="solution-text">${formattedSolution.replace(/\n/g, '<br>')}</div>`;
            solutionContainer.style.display = 'block';
        } else {
            solutionContainer.innerText = 'No solution found.';
            solutionContainer.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
