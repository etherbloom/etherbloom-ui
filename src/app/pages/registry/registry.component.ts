import { Component, OnInit } from '@angular/core';
import { IndexerService } from 'src/app/services/indexer.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css']
})
export class RegistryComponent implements OnInit {

  _mintedCount = 0;
  constructor(private indexerService: IndexerService) { }

  ngOnInit(): void {
    this.indexerService.fetch('blooms').then((b) => this._mintedCount = Object.keys(b).length);
  }

  get mintedCount(): string {
    return this._mintedCount ? this._mintedCount.toString() : '';
  }
}
