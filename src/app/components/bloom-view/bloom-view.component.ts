import {Component, AfterViewInit, Input} from '@angular/core';
import {BlockchainService} from 'src/app/services/blockchain.service';
import {IndexerService} from 'src/app/services/indexer.service';

@Component({
  selector: 'app-bloom-view',
  templateUrl: './bloom-view.component.html',
  styleUrls: ['./bloom-view.component.css'],
})
export class BloomViewComponent implements AfterViewInit {
  p = 1;
  items: any;
  _type = 'all';
  @Input() set type(_type: string) {
    if (!_type) {
      return;
    }
    this._type = _type;
  }

  constructor(
    private indexerService: IndexerService,
    private blockchainService: BlockchainService
  ) {}

  ngAfterViewInit(): void {
    if (this._type === 'all') {
      this.indexerService
        .fetch('blooms')
        .then((bloomData) => (this.items = Object.keys(bloomData)));
    } else if (this._type === 'user') {
      if (!this.blockchainService.connected) {
        setTimeout(() => this.ngAfterViewInit, 100);
        return;
      }
      this.indexerService
        .fetch('user', this.blockchainService.account)
        .then((userData) => (this.items = userData.held));
    }
  }
}
