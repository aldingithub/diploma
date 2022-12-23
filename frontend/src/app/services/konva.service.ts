import { Injectable } from '@angular/core';
import { Image } from 'konva/lib/shapes/Image';
import { Line } from 'konva/lib/shapes/Line';
@Injectable({
  providedIn: 'root'
})
export class KonvaService {
  brushSize!: number;
  brushOpacity!: number;

  brush(pos: any, size: any, color: string, opacity: number): Line {
    this.brushSize = size;
    this.brushOpacity = opacity;
    return new Line({
      stroke: color,
      strokeWidth: size,
      globalCompositeOperation: 'source-over',
      points: [pos.x, pos.y, pos.x, pos.y],
      lineCap: 'round',
      lineJoin: 'round',
      opacity: opacity,
      tension: 0
    });
  }

  erase(pos: any, size: any): Line {
    return new Line({
      stroke: '#ffffff',
      strokeWidth: size,
      globalCompositeOperation: 'source-over',
      points: [pos.x, pos.y, pos.x, pos.y],
      lineCap: 'round',
      lineJoin: 'round'
    });
  }

  image(img: HTMLImageElement): Image {
    return new Image({
      image: img,
      width: img.width,
      height: img.height,
      draggable: false,
      rotation: 0
    });
  }
}
