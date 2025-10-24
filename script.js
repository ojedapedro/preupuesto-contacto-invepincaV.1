// Datos de productos y presentaciones actualizados
const products = {
    'invemanto': {
        name: 'Invemanto',
        presentations: [
            { name: 'Invemanto 9 capas incluye pega manto', price: 200, coverage: 10 },
            { name: 'Invemanto 7 capas incluye pega manto', price: 180, coverage: 8 },
            { name: 'Invemanto 5 capas incluye pega manto', price: 140, coverage: 6 },
            { name: 'Kit tapa goteras (1/4 de pega manto y 10 parchos de invemanto de 15 cm x 15 cm)', price: 50, coverage: 0 }
        ],
        laborOptions: [
            { name: 'No incluir mano de obra', price: 0 },
            { name: 'Mano de obra colocacion de Invemanto', price: 2.50, note: 'Desde 2.50$ x M2 - Previa inspeccion' }
        ]
    },
    'pintura-impermeabilizante': {
        name: 'Pintura Impermeabilizante Elastomerica',
        presentations: [
            { name: 'Cuñete 5/1', price: 100, coverage: 50 },
            { name: 'Cuñete 4/1', price: 90, coverage: 40 },
            { name: 'Galon', price: 25, coverage: 10 },
            { name: 'Kit cuñete 4/1 con 18 m² de malla poliester', price: 150, coverage: 18 },
            { name: 'Kit galon 1/1 con 4.5 m² de malla poliester', price: 40, coverage: 4.5 },
            { name: 'Malla poliester m²', price: 5, coverage: 1 }
        ],
        laborOptions: [
            { name: 'No incluir mano de obra', price: 0 },
            { name: 'Mano de obra aplicacion Pintura impermeabilizante a dos manos', price: 1.30, note: 'Desde 1.30$ x M2 - Previa inspeccion' }
        ]
    }
};

// Elementos del DOM
const productSelect = document.getElementById('product');
const presentationOptions = document.getElementById('presentation-options');
const quantityInput = document.getElementById('quantity');
const laborOptionsContainer = document.getElementById('labor-options');
const laborNote = document.getElementById('labor-note');
const calculateBtn = document.getElementById('calculate-btn');
const resultsDiv = document.getElementById('results');
const resultProduct = document.getElementById('result-product');
const resultPresentation = document.getElementById('result-presentation');
const resultQuantity = document.getElementById('result-quantity');
const resultLabor = document.getElementById('result-labor');
const resultTotal = document.getElementById('result-total');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Variables para almacenar selecciones
let selectedProduct = null;
let selectedPresentation = null;
let selectedLabor = { name: 'No incluir mano de obra', price: 0 };

// Evento cuando se selecciona un producto
productSelect.addEventListener('change', function() {
    const productId = this.value;
    
    if (productId && products[productId]) {
        selectedProduct = products[productId];
        renderPresentationOptions(selectedProduct.presentations);
        renderLaborOptions(selectedProduct.laborOptions);
    } else {
        selectedProduct = null;
        presentationOptions.innerHTML = '<div class="presentation-option"><div class="presentation-name">Seleccione un producto primero</div></div>';
        laborOptionsContainer.innerHTML = '<div class="labor-option"><input type="radio" id="no-labor" name="labor" value="no" checked><label for="no-labor">No incluir mano de obra</label></div>';
        laborNote.textContent = 'Seleccione un producto para ver las opciones de mano de obra disponibles';
    }
});

// Función para renderizar las opciones de presentación
function renderPresentationOptions(presentations) {
    presentationOptions.innerHTML = '';
    
    presentations.forEach((presentation, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'presentation-option';
        optionDiv.dataset.index = index;
        
        optionDiv.innerHTML = `
            <div class="presentation-name">${presentation.name}</div>
            <div class="presentation-price">$${presentation.price}</div>
            ${presentation.coverage > 0 ? `<div class="presentation-coverage">Cubre: ${presentation.coverage} m²</div>` : '<div class="presentation-coverage">No especifica rendimiento</div>'}
        `;
        
        optionDiv.addEventListener('click', function() {
            // Remover la clase selected de todas las opciones
            document.querySelectorAll('.presentation-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Agregar la clase selected a la opción clickeada
            this.classList.add('selected');
            
            // Guardar la presentación seleccionada
            selectedPresentation = presentation;
        });
        
        presentationOptions.appendChild(optionDiv);
    });
}

// Función para renderizar las opciones de mano de obra
function renderLaborOptions(laborOptions) {
    laborOptionsContainer.innerHTML = '';
    
    laborOptions.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'labor-option';
        if (index === 0) optionDiv.classList.add('selected');
        
        const inputId = `labor-option-${index}`;
        
        optionDiv.innerHTML = `
            <input type="radio" id="${inputId}" name="labor" value="${index}" ${index === 0 ? 'checked' : ''}>
            <label for="${inputId}">${option.name}</label>
            ${option.price > 0 ? `<div class="labor-price">$${option.price} x m²</div>` : ''}
        `;
        
        optionDiv.addEventListener('click', function() {
            // Marcar el radio button correspondiente
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Remover la clase selected de todas las opciones
            document.querySelectorAll('.labor-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Agregar la clase selected a la opción clickeada
            this.classList.add('selected');
            
            // Guardar la opción de mano de obra seleccionada
            selectedLabor = option;
            
            // Actualizar la nota
            if (option.note) {
                laborNote.textContent = option.note;
            } else {
                laborNote.textContent = '';
            }
        });
        
        laborOptionsContainer.appendChild(optionDiv);
    });
    
    // Actualizar la nota para la primera opción
    if (laborOptions[0].note) {
        laborNote.textContent = laborOptions[0].note;
    } else {
        laborNote.textContent = '';
    }
}

// Evento para calcular el presupuesto
calculateBtn.addEventListener('click', function() {
    // Validaciones
    if (!selectedProduct) {
        alert('Por favor, seleccione un producto');
        return;
    }
    
    if (!selectedPresentation) {
        alert('Por favor, seleccione una presentación');
        return;
    }
    
    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity <= 0) {
        alert('Por favor, ingrese una cantidad válida');
        return;
    }
    
    // Calcular presupuesto
    let total = 0;
    
    // Calcular cantidad de productos necesarios
    let productUnits = 0;
    if (selectedPresentation.coverage > 0) {
        productUnits = Math.ceil(quantity / selectedPresentation.coverage);
    } else {
        productUnits = 1; // Para productos sin cobertura específica (Kit tapa goteras)
    }
    
    // Calcular costo de productos
    total = productUnits * selectedPresentation.price;
    
    // Agregar costo de mano de obra si está seleccionado
    if (selectedLabor.price > 0) {
        total += quantity * selectedLabor.price;
    }
    
    // Mostrar resultados
    resultProduct.textContent = selectedProduct.name;
    resultPresentation.textContent = selectedPresentation.name;
    resultQuantity.textContent = quantity;
    resultLabor.textContent = selectedLabor.name;
    resultTotal.textContent = total.toFixed(2);
    
    resultsDiv.style.display = 'block';
    
    // Configurar el enlace de WhatsApp
    const message = `Hola, me interesa solicitar un presupuesto para:\n\n` +
                   `Producto: ${selectedProduct.name}\n` +
                   `Presentación: ${selectedPresentation.name}\n` +
                   `Cantidad: ${quantity} m²\n` +
                   `Mano de obra: ${selectedLabor.name}\n` +
                   `Total estimado: $${total.toFixed(2)}\n\n` +
                   `Por favor, contáctenme para más detalles.`;
    
    whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
});