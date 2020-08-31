import { Component , OnInit } from '@angular/core';
import { CoordinatesService } from './services/coordinates.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SIGN_CLASSES } from './config/signClasses';
import {SnackBarComponent} from './components/snack-bar/snack-bar.component'; 
import { throwError, TimeoutError } from 'rxjs';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private tensorFlowModel;
  private fileToUpload;
  public videoUrl;
  public format = 'No format';
  public isLoading = false;
  public wordTranslated;

  constructor(
    private coordinatesService: CoordinatesService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.tensorFlowModel = await tf.loadGraphModel(
      '../../../../../../assets/model.json'
    );
  }

  onClick() {
    const fileUpload = document.getElementById(
      'fileUpload'
    ) as HTMLInputElement;
    fileUpload.click();
  }

  public getTensorFromData(data) {
    return tf.tensor([data]);
  }

  async submitFile() {
    this.isLoading = true;
    try {

      let result = await this.coordinatesService.getCoordinatesFromVirtualMachine(
        this.fileToUpload
      ) as any;
      let prediction = this.tensorFlowModel
        .predict(this.getTensorFromData(result.keypoints))
        .dataSync();
      let indexOfWinnerClass = prediction.indexOf(
        Math.max(...prediction)
      );
      this.wordTranslated = SIGN_CLASSES[indexOfWinnerClass];
      console.log("xxxxxxxxxxxxx PALABRA xxxxxxxxxxxxxxx");
      console.log(this.wordTranslated);
      console.log('............. VALORES ...............');
      console.log(prediction);
      this.openSnackBar(); 
      this.isLoading = false;
    } catch (error) {
      if (error instanceof TimeoutError) {
        console.log("Error de tiempooooooooooooooooooooo")
      }
      console.log(error);
    }
  }

  onSelectFile(event) {
    this.fileToUpload = event.target.files[0];
    console.log("que pedo krnal")
    console.log(this.fileToUpload)
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.videoUrl = (<FileReader>event.target).result;
      };
    }
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: {
        word: this.wordTranslated
      },
    });
  }

  onCancelVideo() {
    this.format = 'No format';
    this.videoUrl = null;
    this.fileToUpload = null;
    const fileUpload = document.getElementById(
      'fileUpload'
    ) as HTMLInputElement;
    fileUpload.value = null;
  }
}
