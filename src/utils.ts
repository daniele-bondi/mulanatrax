import { TileLink } from './db';

export function seededRandomColor(seed: string) {
  let res = 0;

  for (let i = 0; i < seed.length; ++i) res = res * 10 + seed[i].charCodeAt(0) - '0'.charCodeAt(0);
  return '#' + Math.floor(Math.abs(Math.sin(res) * 16777215) % 16777215).toString(16);
}

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export async function readFileAsDataURL(file: File): Promise<string> {
  let result_base64: string = await new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onload = (e) => resolve(fileReader.result as string);
    fileReader.readAsDataURL(file);
  });

  return result_base64;
}

async function getImageSrc1(files: File[]) {
  const img = new Image();
  img.src = await readFileAsDataURL(files[0]);
  await img.decode();

  const canvas: HTMLCanvasElement = document.getElementById('cropcanvas') as any;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sourceX = 0;
  const sourceY = 0;
  const sourceW = 1280;
  const sourceH = 960;

  const targetX = 0;
  const targetY = 0;
  const targetW = sourceW / 2;
  const targetH = sourceH / 2;
  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, targetX, targetY, targetW, targetH);
  return canvas.toDataURL();
}


async function getImageSrc2(files: File[]) {
  const img = new Image();
  img.src = await readFileAsDataURL(files[0]);
  await img.decode();

  const canvas: HTMLCanvasElement = document.getElementById('cropcanvas') as any;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sourceX = 128;
  const sourceY = 60;
  const sourceW = 1664;
  const sourceH = 926;

  const targetX = 0;
  const targetY = 0;
  const targetW = sourceW / 2;
  const targetH = sourceH / 2;
  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, targetX, targetY, targetW, targetH);
  return canvas.toDataURL();
}


export async function getImageSrc(files: File[], mode: number = 1) {
  switch (mode)
  {
    case 1:
      return getImageSrc1(files);
    case 2:
      return getImageSrc2(files);
  }
}


async function getImageForOcr1(image: HTMLImageElement)
{
  const canvas: HTMLCanvasElement = document.getElementById('cropcanvas') as any;
  const drawContext = canvas.getContext('2d');
  if (!drawContext) {
    return;
  }
  drawContext.clearRect(0, 0, canvas.width, canvas.height);

  const sourceX = 0;
  const sourceY = 0;
  const sourceW = 1280;
  const sourceH = 960;
  drawContext.drawImage(image, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW / 2, sourceH / 2);
  return canvas.toDataURL();
}


async function getImageForOcr2(image: HTMLImageElement) {
  const canvas: HTMLCanvasElement = document.getElementById('cropcanvas') as any;
  const drawContext = canvas.getContext('2d');
  if (!drawContext) {
    return;
  }
  drawContext.clearRect(0, 0, canvas.width, canvas.height);

  const sourceX = 200;
  const sourceY = 140;
  const sourceW = 1520;
  const sourceH = 800;
  drawContext.drawImage(image, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW / 2, sourceH / 2);
  return canvas.toDataURL();
}

export async function getImageForOcr(file: File, mode: number = 1) {
  const image = new Image();
  image.src = await readFileAsDataURL(file);
  await image.decode();

  switch (mode)
  {
    case 1:
      return getImageForOcr1(image);
    case 2:
      return getImageForOcr2(image);
  }
}


export function drawLinks(links: TileLink[]) {
  const c: HTMLCanvasElement = document.getElementById('linecanvas') as any;
  const ctx = c.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.clearRect(0, 0, c.width, c.height);
  links.forEach((link) => {
    const fromTile = document.getElementById(`tile_${link.from}`);
    const toTile = document.getElementById(`tile_${link.to}`);
    if (fromTile && toTile) {
      ctx.beginPath();
      ctx.moveTo(fromTile?.offsetLeft + link.fromOffsetX, fromTile?.offsetTop + link.fromOffsetY);
      ctx.lineTo(toTile?.offsetLeft + link.toOffsetX, toTile?.offsetTop + link.toOffsetY);
      ctx.strokeStyle = seededRandomColor(`${link.from} + ${link.to}`);
      ctx.lineWidth = 5;
      ctx.shadowColor = 'gray';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.stroke();
      ctx.closePath();
    }
  });
}

export const fuseOptions = {
  keys: ['name', 'notes'],
  findAllMatches: true,
  threshold: 0.7,
  ignoreLocation: true,
  useExtendedSearch: true,
};
