const converterType = document.getElementById('converter-type');
const converterForm = document.getElementById('converter-form');
const resultEl = document.getElementById('result');

const convertCurrency = (amount, from, to) => {
  const rates = { USD: 1, INR: 83, EUR: 0.93, GBP: 0.8, JPY: 147 };
  return (amount / rates[from]) * rates[to];
}

const convertTemperature = (value, from, to) => {
  if(from === to) return value;
  if(from === 'C') return to === 'F' ? (value * 9/5) + 32 : value + 273.15;
  if(from === 'F') return to === 'C' ? (value - 32) * 5/9 : (value - 32) * 5/9 + 273.15;
  if(from === 'K') return to === 'C' ? value - 273.15 : (value - 273.15) * 9/5 + 32;
}

const convertLength = (value, from, to) => {
  const factors = { m:1, km:1000, cm:0.01, mm:0.001, ft:0.3048, in:0.0254, mile:1609.34 };
  return value * factors[from] / factors[to];
}

const convertWeight = (value, from, to) => {
  const factors = { kg:1, g:0.001, lb:0.453592, oz:0.0283495 };
  return value * factors[from] / factors[to];
}

const convertVolume = (value, from, to) => {
  const factors = { l:1, ml:0.001, gal:3.78541, cup:0.24 };
  return value * factors[from] / factors[to];
}

const calculateBMI = (weight, height) => {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = '';
  if(bmi < 18.5) category = 'Underweight';
  else if(bmi < 24.9) category = 'Normal weight';
  else if(bmi < 29.9) category = 'Overweight';
  else category = 'Obese';
  return { bmi: bmi.toFixed(2), category };
}

converterType.addEventListener('change', () => {
  const type = converterType.value;
  let html = '';
  if(!type) { converterForm.innerHTML = ''; resultEl.textContent = '--'; return; }

  switch(type) {
    case 'currency':
      html = `
        <input type="number" id="inputValue" placeholder="Enter amount">
        <select id="fromUnit">
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
        <select id="toUnit">
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
        <button id="convertBtn">Convert</button>`;
      break;
    case 'temperature':
      html = `
        <input type="number" id="inputValue" placeholder="Enter value">
        <select id="fromUnit">
          <option value="C">Celsius</option>
          <option value="F">Fahrenheit</option>
          <option value="K">Kelvin</option>
        </select>
        <select id="toUnit">
          <option value="C">Celsius</option>
          <option value="F">Fahrenheit</option>
          <option value="K">Kelvin</option>
        </select>
        <button id="convertBtn">Convert</button>`;
      break;
    case 'length':
      html = `
        <input type="number" id="inputValue" placeholder="Enter value">
        <select id="fromUnit">
          <option value="m">Meters</option>
          <option value="km">Kilometers</option>
          <option value="cm">Centimeters</option>
          <option value="mm">Millimeters</option>
          <option value="ft">Feet</option>
          <option value="in">Inches</option>
          <option value="mile">Miles</option>
        </select>
        <select id="toUnit">
          <option value="m">Meters</option>
          <option value="km">Kilometers</option>
          <option value="cm">Centimeters</option>
          <option value="mm">Millimeters</option>
          <option value="ft">Feet</option>
          <option value="in">Inches</option>
          <option value="mile">Miles</option>
        </select>
        <button id="convertBtn">Convert</button>`;
      break;
    case 'weight':
      html = `
        <input type="number" id="inputValue" placeholder="Enter value">
        <select id="fromUnit">
          <option value="kg">Kilogram</option>
          <option value="g">Gram</option>
          <option value="lb">Pound</option>
          <option value="oz">Ounce</option>
        </select>
        <select id="toUnit">
          <option value="kg">Kilogram</option>
          <option value="g">Gram</option>
          <option value="lb">Pound</option>
          <option value="oz">Ounce</option>
        </select>
        <button id="convertBtn">Convert</button>`;
      break;
    case 'volume':
      html = `
        <input type="number" id="inputValue" placeholder="Enter value">
        <select id="fromUnit">
          <option value="l">Liters</option>
          <option value="ml">Milliliters</option>
          <option value="gal">Gallons</option>
          <option value="cup">Cups</option>
        </select>
        <select id="toUnit">
          <option value="l">Liters</option>
          <option value="ml">Milliliters</option>
          <option value="gal">Gallons</option>
          <option value="cup">Cups</option>
        </select>
        <button id="convertBtn">Convert</button>`;
      break;
    case 'bmi':
      html = `
        <input type="number" id="weight" placeholder="Weight (kg)">
        <input type="number" id="height" placeholder="Height (cm)">
        <button id="convertBtn">Calculate BMI</button>`;
      break;
  }

  converterForm.innerHTML = html;

  document.getElementById('convertBtn').addEventListener('click', () => {
    let converted;
    if(type === 'bmi') {
      const weight = parseFloat(document.getElementById('weight').value);
      const height = parseFloat(document.getElementById('height').value);
      if(isNaN(weight) || isNaN(height)) { resultEl.textContent = '❌ Enter valid numbers'; return; }
      const bmiObj = calculateBMI(weight, height);
      resultEl.textContent = `BMI: ${bmiObj.bmi} → ${bmiObj.category}`;
      return;
    }

    const value = parseFloat(document.getElementById('inputValue').value);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;
    if(isNaN(value)) { resultEl.textContent = '❌ Enter a valid number'; return; }

    switch(type) {
      case 'currency': converted = convertCurrency(value, from, to); break;
      case 'temperature': converted = convertTemperature(value, from, to); break;
      case 'length': converted = convertLength(value, from, to); break;
      case 'weight': converted = convertWeight(value, from, to); break;
      case 'volume': converted = convertVolume(value, from, to); break;
    }
    if(converted !== undefined) resultEl.textContent = `${value} ${from} = ${converted.toFixed(2)} ${to}`;
  });
});
