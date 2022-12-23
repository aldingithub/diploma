import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppComponent } from './app.component';
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { KonvaService } from './services/konva.service';
@NgModule({
  declarations: [
    AppComponent,
    WhiteboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatSliderModule,
    MatBottomSheetModule,
    HttpClientModule,
    NgSelectModule
  ],
  providers: [
    KonvaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
