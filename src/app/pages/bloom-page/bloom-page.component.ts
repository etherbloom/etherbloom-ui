import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bloom-page',
  templateUrl: './bloom-page.component.html',
  styleUrls: ['./bloom-page.component.css']
})
export class BloomPageComponent implements OnInit {

  hash = '';
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.hash = params['id'];
    });
  }

  ngOnInit(): void {
  }

}
