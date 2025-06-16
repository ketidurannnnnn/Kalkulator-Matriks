// Inisialisasi matriks saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    generateMatrix('A');
    generateMatrix('B');
});

// Event listeners untuk perubahan ukuran matriks
document.getElementById('rowsA').addEventListener('change', () => generateMatrix('A'));
document.getElementById('colsA').addEventListener('change', () => generateMatrix('A'));
document.getElementById('rowsB').addEventListener('change', () => generateMatrix('B'));
document.getElementById('colsB').addEventListener('change', () => generateMatrix('B'));

// Fungsi untuk membuat grid matriks
function generateMatrix(matrix) {
    const rows = parseInt(document.getElementById(`rows${matrix}`).value);
    const cols = parseInt(document.getElementById(`cols${matrix}`).value);
    const container = document.getElementById(`matrix${matrix}`);
    
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.id = `${matrix}_${i}_${j}`;
            input.placeholder = '0';
            input.value = '0';
            container.appendChild(input);
        }
    }
}

// Fungsi untuk mengambil nilai matriks
function getMatrix(matrix) {
    const rows = parseInt(document.getElementById(`rows${matrix}`).value);
    const cols = parseInt(document.getElementById(`cols${matrix}`).value);
    const result = [];
    
    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`${matrix}_${i}_${j}`).value) || 0;
            result[i][j] = value;
        }
    }
    return result;
}

// Fungsi untuk menampilkan hasil
function displayResult(matrix, title) {
    const resultDiv = document.getElementById('result');
    let html = `<h4>${title}</h4>`;
    
    if (typeof matrix === 'number') {
        html += `<div class="scalar-result">${matrix.toFixed(4)}</div>`;
    } else if (Array.isArray(matrix)) {
        html += '<div class="result-matrix" style="grid-template-columns: repeat(' + matrix[0].length + ', 1fr);">';
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                html += `<div class="result-cell">${matrix[i][j].toFixed(2)}</div>`;
            }
        }
        html += '</div>';
    }
    
    resultDiv.innerHTML = html;
}

// Fungsi untuk menampilkan error
function displayError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="error">❌ Error: ${message}</div>`;
}

// Operasi penjumlahan matriks
function addMatrices() {
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');
    
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        displayError('Ukuran matriks A dan B harus sama untuk penjumlahan!');
        return;
    }
    
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixA[i].length; j++) {
            result[i][j] = matrixA[i][j] + matrixB[i][j];
        }
    }
    
    displayResult(result, '➕ Hasil Penjumlahan A + B');
}

// Operasi pengurangan matriks
function subtractMatrices() {
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');
    
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        displayError('Ukuran matriks A dan B harus sama untuk pengurangan!');
        return;
    }
    
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixA[i].length; j++) {
            result[i][j] = matrixA[i][j] - matrixB[i][j];
        }
    }
    
    displayResult(result, '➖ Hasil Pengurangan A - B');
}

// Operasi perkalian matriks
function multiplyMatrices() {
    const matrixA = getMatrix('A');
    const matrixB = getMatrix('B');
    
    if (matrixA[0].length !== matrixB.length) {
        displayError('Jumlah kolom matriks A harus sama dengan jumlah baris matriks B!');
        return;
    }
    
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    
    displayResult(result, '✖️ Hasil Perkalian A × B');
}

// Operasi transpose matriks
function transposeMatrix(matrix) {
    const mat = getMatrix(matrix);
    const result = [];
    
    for (let i = 0; i < mat[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < mat.length; j++) {
            result[i][j] = mat[j][i];
        }
    }
    
    displayResult(result, `🔄 Transpose Matriks ${matrix}`);
}

// Fungsi untuk menghitung determinan
function calculateDeterminant(matrix) {
    const n = matrix.length;
    
    if (n === 1) {
        return matrix[0][0];
    }
    
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < n; i++) {
        const subMatrix = [];
        for (let j = 1; j < n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    row.push(matrix[j][k]);
                }
            }
            subMatrix.push(row);
        }
        det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(subMatrix);
    }
    return det;
}

// Operasi determinan
function determinant(matrix) {
    const mat = getMatrix(matrix);
    
    if (mat.length !== mat[0].length) {
        displayError('Determinan hanya dapat dihitung untuk matriks persegi!');
        return;
    }
    
    const det = calculateDeterminant(mat);
    displayResult(det, `🎯 Determinan Matriks ${matrix}`);
}

// Fungsi untuk menghitung invers matriks
function calculateInverse(matrix) {
    const n = matrix.length;
    const det = calculateDeterminant(matrix);
    
    if (Math.abs(det) < 1e-10) {
        return null; // Matriks singular
    }
    
    if (n === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }
    
    // Untuk matriks 3x3 atau lebih besar, menggunakan adjugate matrix
    const adjugate = [];
    for (let i = 0; i < n; i++) {
        adjugate[i] = [];
        for (let j = 0; j < n; j++) {
            const subMatrix = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const row = [];
                    for (let l = 0; l < n; l++) {
                        if (l !== j) {
                            row.push(matrix[k][l]);
                        }
                    }
                    subMatrix.push(row);
                }
            }
            adjugate[i][j] = Math.pow(-1, i + j) * calculateDeterminant(subMatrix);
        }
    }
    
    // Transpose adjugate dan bagi dengan determinan
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = adjugate[j][i] / det;
        }
    }
    
    return result;
}

// Operasi invers
function inverse(matrix) {
    const mat = getMatrix(matrix);
    
    if (mat.length !== mat[0].length) {
        displayError('Invers hanya dapat dihitung untuk matriks persegi!');
        return;
    }
    
    if (mat.length > 3) {
        displayError('Invers matriks hanya tersedia untuk matriks maksimal 3×3!');
        return;
    }
    
    const inv = calculateInverse(mat);
    
    if (!inv) {
        displayError('Matriks tidak memiliki invers (determinan = 0)!');
        return;
    }
    
    displayResult(inv, `🔀 Invers Matriks ${matrix}`);
}

// Fungsi untuk membersihkan matriks
function clearMatrix(matrix) {
    const rows = parseInt(document.getElementById(`rows${matrix}`).value);
    const cols = parseInt(document.getElementById(`cols${matrix}`).value);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`${matrix}_${i}_${j}`).value = '0';
        }
    }
}