import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Layer } from 'konva/lib/Layer';
import { Stage } from 'konva/lib/Stage';
import { tap } from 'rxjs';
import { black, brush, eraser, furniture, white } from '../../const';
import { Image } from '../../models/image';
import { BackendApiService } from '../../services/backend-api.service';
import { KonvaService } from '../../services/konva.service';

@Component({
  selector: 'app-whiteboard-page',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  stage!: Stage;
  layer!: Layer;
  file: File;
  loadSpinner = false;
  imageSource: SafeResourceUrl;
  imageBase64: string;
  furniture = furniture;
  selectedFurniture = furniture[0];
  stageDraggable = false;
  selectedButton: any = {
    'brush': false,
    'eraser': false
  }

  constructor(
    private readonly konvaService: KonvaService,
    private readonly sanitizer: DomSanitizer,
    private readonly apiService: BackendApiService
  ) { }

  ngOnInit(): void {
    this.selectedButton[eraser] = false;
    this.selectedButton[brush] = true;
    this.stage = new Stage({
      container: 'container',
      width: 400,
      height: 400,
    });

    this.layer = new Layer();
    this.stage.add(this.layer);
    this.addLineListeners();
    this.addWhiteBackground();
    this.convertToImage();
  }

  toggleDragging() {
    this.stageDraggable = !this.stageDraggable;
    this.stage.setDraggable(this.stageDraggable);
    this.selectedButton[brush] = false;
    this.selectedButton[eraser] = false;
  }

  addLineListeners(): void {
    const component = this;
    let lastLine: any;
    let isPaint: boolean = false;
    const control_container = document.getElementById('control_container');

    this.stage.on('mousedown touchstart', function () {
      if (!component.selectedButton[brush] && !component.selectedButton[eraser]) {
        return;
      }
      isPaint = true;
      let pos = component.stage.getPointerPosition();
      lastLine = component.selectedButton[eraser] ? component.konvaService.erase(pos, 30) :
        component.konvaService.brush(pos, 1, black, 1.0);
      component.layer.add(lastLine);
      control_container?.classList.add('hide_palette');
    });

    this.stage.on('mouseup touchend', function () {
      isPaint = false;
      component.convertToImage();
      control_container?.classList.remove('hide_palette');
    });

    this.stage.on('mousemove touchmove', function (e) {
      if (!isPaint) {
        return;
      }
      e.evt.preventDefault();
      const position: any = component.stage.getPointerPosition();
      const newPoints = lastLine.points().concat([position.x, position.y]);
      lastLine.points(newPoints);
      component.layer.batchDraw();
    });
  }

  clearBoard(): void {
    this.addWhiteBackground();
    this.convertToImage();
  }

  setSelection(type: string) {
    this.clearSelection();
    this.selectedButton[type] = true;
    if (type !== brush) this.selectedButton[brush] = false;
    switch (type) {
      case "eraser":
        this.selectedButton[eraser] = true;
        break;
      case "brush":
        this.selectedButton[eraser] = false;
        this.selectedButton[brush] = true;
        break;
      default:
        this.selectedButton[eraser] = false;
        break;
    }
  }

  downloadImage(): void {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = this.imageBase64;
    link.click();
  }

  convertToImage(): void {
    const formData = new FormData();
    formData.append('image', this.prepareSketch());
    formData.append('type', this.selectedFurniture.backendName);
    this.apiConvert(formData);
  }

  getCursorClass(): string {
    if (this.selectedButton[brush] || this.selectedButton[eraser]) {
      return 'pointer_cursor';
    } else {
      return 'default';
    }
  }

  onUploadSketch(event: any): void {
    this.file = event.target.files[0];
    let img = new Image();
    img.src = window.URL.createObjectURL(this.file);

    img.onload = () => {
      this.addWhiteBackground();
      this.layer.add(this.konvaService.image(img));
      this.layer.draw();
      this.convertToImage();
    }
  }

  colorizeImage(): void {
    this.loadSpinner = true;
    this.apiService.colorizeImage()
      .pipe(tap(() => this.loadSpinner = false))
      .subscribe({
        next: img => this.onImageResponse(img),
        error: err => console.log(err)
      })
  }

  private addWhiteBackground(): void {
    let whiteBoard = this.konvaService.brush({ x: 844, y: 470 }, 3000, white, 1.0)
    this.layer.add(whiteBoard)
  }

  private apiConvert(formData: FormData): void {
    this.loadSpinner = true;
    this.apiService.convertSketchToImage(formData)
      .pipe(tap(() => this.loadSpinner = false))
      .subscribe({
        next: img => this.onImageResponse(img),
        error: err => console.log(err)
      })
  }

  private clearSelection(): void {
    this.selectedButton = {
      brush: false,
      eraser: false
    }
  }

  private prepareSketch(): string {
    return this.stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 1,
      height: 400,
      width: 400
    });
  }

  private onImageResponse(img: Image): void {
    this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${img.base64Image}`);
    this.imageBase64 = `data:image/png;base64,${img.base64Image}`;
  }
}
