import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {BlockchainService} from 'src/app/services/blockchain.service';
import {IndexerService} from 'src/app/services/indexer.service';

@Component({
  selector: 'app-bloom-view-panel',
  templateUrl: './bloom-view-panel.component.html',
  styleUrls: ['./bloom-view-panel.component.css'],
})
export class BloomViewPanelComponent implements OnInit {
  p: any = 1;

  hash = '';
  seed = '';
  networkId = 0;
  bloomLink = '';
  _clickable = true;

  @Input() set bloom(_hash: string) {
    if (!_hash) {
      return;
    }
    this.hash = _hash;
    this.indexerService.fetch('bloom', this.hash).then((b) => {
      console.log(b);
      this.seed = b.seed;
      this.networkId = b.network;
      this.bloomLink = `/bloom/${_hash}`;
    });
  }
  @Input() set clickable(_click: boolean) {
    if (!_click) {
      return;
    }
    this._clickable = _click;
  }

  get network(): string {
    const nn = this.blockchainService.networks.name[this.networkId];
    return nn === 'Ava' ? 'Avalanche' : nn;
  }

  constructor(
    private blockchainService: BlockchainService,
    private indexerService: IndexerService
  ) {}

  ngOnInit(): void {}

  onClick(event: MouseEvent) {
    if (!this._clickable) {
      return;
    }
  }

}
