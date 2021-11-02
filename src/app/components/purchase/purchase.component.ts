import {Component} from '@angular/core';
import { ethers } from 'ethers';
import {BlockchainService} from 'src/app/services/blockchain.service';
// import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {IndexerService} from 'src/app/services/indexer.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
})
export class PurchaseComponent {
  // faSpinner = faSpinner;
  seed: string = '';
  seeds: any = {};
  valid: boolean = false;
  inFlight: boolean = false;
  taken: boolean = false;
  _salePrice: any
  constructor(
    private indexerService: IndexerService,
    public blockchainService: BlockchainService
  ) {}

  kpa(event: any) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-z A-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  ku(event: any) {
    if (!this.blockchainService.seeds || !this.seed) {
      this.valid = false;
      return;
    }
    const o = this.seed.toLowerCase();
    if (this.blockchainService.seeds[this.seed]) {
      this.valid = false;
      this.taken = true;
    } else {
      this.valid = true;
      this.taken = false;
    }
  }

  mintBloomClicked() {
    if (!this.seed) {
      return;
    }
    this.inFlight = true;
    this.blockchainService
      .purchaseBloom(this.seed)
      .then(() => {
        this.inFlight = false;
      })
      .catch(() => {
        this.inFlight = false;
        console.error('cancelled')
      });
  }

  get buttonDisabled() {
    return !this.valid || !this.blockchainService.connected;
  }

  get salePrice(): string {
    if(!this.blockchainService.salePrice) {
      return '';
    }

    return ethers.utils.formatEther(this.blockchainService.salePrice.toHexString()) + ' ' + this.blockchainService.networks.coin[this.blockchainService.networkId];
  }

  get coin(): string {
    return '';
  }
}
