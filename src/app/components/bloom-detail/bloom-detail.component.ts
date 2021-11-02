import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bloom-detail',
  templateUrl: './bloom-detail.component.html',
  styleUrls: ['./bloom-detail.component.css']
})
export class BloomDetailComponent implements OnInit {

  _bloom: any;
  @Input() set bloom(_hash: string) {
    if (!_hash) {
      return;
    }
    this._bloom = _hash;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
