const fs = require('fs');
const path = require('path');

function inspectGlb(filePath) {
  const buf = fs.readFileSync(filePath);
  const jsonLen = buf.readUInt32LE(12);
  const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
  const json = JSON.parse(jsonStr);
  
  console.log(`=== ${path.basename(filePath)} ===`);
  if (json.nodes) {
    console.log('Nodes:', json.nodes.map(n => ({ name: n.name, translation: n.translation, rotation: n.rotation, scale: n.scale })));
  }
  if (json.accessors && json.accessors[0]) {
    json.meshes?.forEach(m => {
      m.primitives?.forEach(p => {
        const posAccIdx = p.attributes.POSITION;
        const acc = json.accessors[posAccIdx];
        if (acc && acc.min && acc.max) {
          const center = [(acc.min[0] + acc.max[0])/2, (acc.min[1] + acc.max[1])/2, (acc.min[2] + acc.max[2])/2];
          const size = [acc.max[0] - acc.min[0], acc.max[1] - acc.min[1], acc.max[2] - acc.min[2]];
          console.log(`Mesh ${m.name || 'unnamed'} -> min: [${acc.min.map(v => v.toFixed(3))}] max: [${acc.max.map(v => v.toFixed(3))}] center: [${center.map(v => v.toFixed(3))}] size: [${size.map(v => v.toFixed(3))}]`);
        }
      });
    });
  }
}

const modelsDir = path.join(__dirname, '../public/models');
fs.readdirSync(modelsDir).filter(f => f.endsWith('.glb')).forEach(f => {
  inspectGlb(path.join(modelsDir, f));
});
