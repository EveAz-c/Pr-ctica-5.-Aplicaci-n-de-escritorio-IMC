
function clasificarIMC(imc) {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
}


function renderHistory(history) {
  const lista = document.getElementById('historial');
  lista.innerHTML = '';
  
  history.slice().reverse().forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.fecha} - Peso: ${item.peso} kg, Altura: ${item.altura} cm → IMC: ${item.imc.toFixed(2)} (${item.clasificacion})`;
    lista.appendChild(li);
  });
}


let history = [];

window.electronAPI.readHistory().then((data) => {
  history = data;
  renderHistory(history);
}).catch(err => {
  console.error('Error al cargar historial:', err);
});


document.getElementById('imc-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const peso = parseFloat(document.getElementById('peso').value);
  const alturaCm = parseFloat(document.getElementById('altura').value);
  const alturaM = alturaCm / 100;

  if (isNaN(peso) || isNaN(alturaCm) || peso <= 0 || alturaCm <= 0) {
    alert('Por favor ingresa valores válidos.');
    return;
  }

  const imc = peso / (alturaM ** 2);
  const clasificacion = clasificarIMC(imc);

  
  document.getElementById('resultado').innerHTML = `
    <p><strong>Tu IMC es: ${imc.toFixed(2)}</strong> (${clasificacion})</p>
  `;

  
  const nuevoRegistro = {
    fecha: new Date().toLocaleString(),
    peso: peso,
    altura: alturaCm,
    imc: imc,
    clasificacion: clasificacion
  };

  history.push(nuevoRegistro);

  
  try {
    await window.electronAPI.saveHistory(history);
    renderHistory(history);
  } catch (err) {
    console.error('Error al guardar historial:', err);
  }

  
  document.getElementById('peso').value = '';
  document.getElementById('altura').value = '';
});