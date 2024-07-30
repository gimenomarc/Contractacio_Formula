import React, { useState, useEffect } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import 'tailwindcss/tailwind.css';

function App() {
  const [a, setA] = useState('65'); // Puntuació total a repartir en oferta economica.
  const [b, setBValue] = useState('5');  // Puntuació a repartir linealment.

  useEffect(() => {
    document.title = "Generador de Fórmulas Matemáticas";
  }, []);

  // Convertir los valores de a y b a números solo si no están vacíos
  const numA = a === '' ? 0 : Number(a);
  const numB = b === '' ? 0 : Number(b);

  // Realizar la operación directamente
  const diff = numA - numB;
  const twoDiff = 2 * diff;
  const twoAminusB = 2 * numA - numB;

  const formula1 = `
  \\text{Punts} = \\frac{${diff} \\times B_{max} - ${numA} \\times B_{mig,c} \\times B(\\%)^2 - 
  (${twoDiff} \\times B_{max} - ${twoAminusB} \\times B_{mig,c}) \\times B(\\%)}
  {B_{mig,c}^2 \\times (B_{mig,c} - B_{max})}
  `;

  const formula2 = `
  \\text{Punts} = \\frac{${numB} \\times B(\\%) + ${diff} \\times B_{max} - ${numA} \\times B_{mig,c}}
  {B_{max} - B_{mig,c}}
  `;

  return (
    <MathJaxContext config={{
      loader: { load: ["input/tex", "output/chtml"] },
      tex: { inlineMath: [["\\(", "\\)"], ["$", "$"]], displayMath: [["\\[", "\\]"], ["$$", "$$"]] }
    }}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-screen-lg overflow-hidden">
          <h1 className="text-3xl font-bold mb-6 text-center">Generador de Fórmules Matemàtiques V5.2</h1>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Puntuació total a repartir en oferta economica (a)
              </label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Puntuació a repartir linealment (b)
              </label>
              <input
                type="number"
                value={b}
                onChange={(e) => setBValue(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </form>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Si B(%) &lt; Bmig,c</h2>
            <div>
              <MathJax inline dynamic>{`\\(${formula1}\\)`}</MathJax>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Si Bmig,c ≤ B(%) ≤ Bmax</h2>
            <div>
              <MathJax inline dynamic>{`\\(${formula2}\\)`}</MathJax>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default App;

