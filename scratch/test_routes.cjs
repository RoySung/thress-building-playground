function addArc(points, cx, cz, radius, startAngle, endAngle, steps = 6) {
  for (let i = 1; i <= steps; i++) {
    const a = startAngle + (endAngle - startAngle) * (i / steps);
    points.push({
      x: Number((cx + radius * Math.cos(a)).toFixed(3)),
      z: Number((cz + radius * Math.sin(a)).toFixed(3)),
    });
  }
}

// Right Turn helper
function addRightTurn(pts, X_in, Z_in, X_out, Z_out, dirIn, r = 0.75) {
  if (dirIn === 'N') { // North (-Z) -> East (+X)
    pts.push({ x: X_in, z: Z_out + r });
    addArc(pts, X_in + r, Z_out + r, r, Math.PI, Math.PI * 1.5);
  } else if (dirIn === 'E') { // East (+X) -> South (+Z)
    pts.push({ x: X_out - r, z: Z_in });
    addArc(pts, X_out - r, Z_in + r, r, -Math.PI / 2, 0);
  } else if (dirIn === 'S') { // South (+Z) -> West (-X)
    pts.push({ x: X_in, z: Z_out - r });
    addArc(pts, X_in - r, Z_out - r, r, 0, Math.PI / 2);
  } else if (dirIn === 'W') { // West (-X) -> North (-Z)
    pts.push({ x: X_out + r, z: Z_in });
    addArc(pts, X_out + r, Z_in - r, r, Math.PI / 2, Math.PI);
  }
}

// Left Turn helper
function addLeftTurn(pts, X_in, Z_in, X_out, Z_out, dirIn, r = 2.25) {
  if (dirIn === 'N') { // North (-Z) -> West (-X)
    pts.push({ x: X_in, z: Z_out + r });
    addArc(pts, X_in - r, Z_out + r, r, 0, -Math.PI / 2);
  } else if (dirIn === 'W') { // West (-X) -> South (+Z)
    pts.push({ x: X_out + r, z: Z_in });
    addArc(pts, X_out + r, Z_in + r, r, -Math.PI / 2, -Math.PI);
  } else if (dirIn === 'S') { // South (+Z) -> East (+X)
    pts.push({ x: X_in, z: Z_out - r });
    addArc(pts, X_in + r, Z_out - r, r, Math.PI, Math.PI / 2);
  } else if (dirIn === 'E') { // East (+X) -> North (-Z)
    pts.push({ x: X_out - r, z: Z_in });
    addArc(pts, X_out - r, Z_in - r, r, Math.PI / 2, 0);
  }
}

const R = 16;
const L1 = 0.75;
const L2 = 0.75;

function getInnerWestLoop() {
  const pts = [];
  addRightTurn(pts, -L1, R - L1, -R + L1, R - L1, 'S');
  addRightTurn(pts, -R + L1, R - L1, -R + L1, -R + L1, 'W');
  addRightTurn(pts, -R + L1, -R + L1, -L1, -R + L1, 'N');
  addRightTurn(pts, -L1, -R + L1, -L1, R - L1, 'E');
  return pts;
}

console.log('Sample Inner West points:', getInnerWestLoop().slice(0, 15));
