// Four-neighbour regions of the original line art; added brush strokes do not change them.
export function findRegions(white: Uint8Array, width: number, height: number) {
  if (white.length !== width * height || width < 1 || height < 1)
    throw new Error("Invalid region dimensions.");
  const labels = new Int32Array(white.length).fill(-1);
  const queue = new Int32Array(white.length);
  const sizes: number[] = [];
  for (let seed = 0; seed < white.length; seed++) {
    if (!white[seed] || labels[seed] !== -1) continue;
    const region = sizes.length;
    let head = 0,
      tail = 1;
    queue[0] = seed;
    labels[seed] = region;
    while (head < tail) {
      const index = queue[head++]!;
      const x = index % width;
      const visit = (next: number) => {
        if (white[next] && labels[next] === -1) {
          labels[next] = region;
          queue[tail++] = next;
        }
      };
      if (x > 0) visit(index - 1);
      if (x + 1 < width) visit(index + 1);
      if (index >= width) visit(index - width);
      if (index + width < white.length) visit(index + width);
    }
    sizes.push(tail);
  }
  return { labels, sizes };
}
