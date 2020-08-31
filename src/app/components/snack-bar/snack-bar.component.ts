import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css'],
})
export class SnackBarComponent implements OnInit {
  @Input() public word;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.word = data.word;
  }

  ngOnInit(): void {}
}
