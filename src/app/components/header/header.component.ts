import { Component, OnInit } from '@angular/core';
import { Web3ModalService } from "@mindsorg/web3modal-angular";
import { BlockchainService } from 'src/app/services/blockchain.service';
import { IndexerService } from 'src/app/services/indexer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  _connected = false;
  _allTokensLength = 0;
  constructor(private indexerService: IndexerService, public blockchainService: BlockchainService) { }

  ngOnInit(): void {

  }

  connectClicked() {
    this.blockchainService.connectAccount().then(() => {
      this._connected = true;
    })
  }

  get siteTitle(): any {
    return this._connected ? this.blockchainService.networks.name[this.blockchainService.networkId] + 'bloom' : 'Etherbloom';
  }

  get buttonStyle(): any {
    return {
      fontFamily: 'montserrat',
      background: this._connected ? 'var(--bs-green)' : 'var(--bs-pink)',
      marginTop: '5px',
      marginBottom: '5px'
    }
  }

  get isHolder(): boolean {
    if (!this.blockchainService || !this.blockchainService.connected) {
      return false;
    }
    if (!this.blockchainService.accountData || !this.blockchainService.accountData[0]) {
      return false;
    }
    return this.blockchainService.accountData[0].length > 0;
  }

  get balance(): number {
    if (!this.blockchainService || !this.blockchainService.connected) {
      return 0;
    }
    if (!this.blockchainService.accountData|| !this.blockchainService.accountData.blooms) {
      return 0;
    }
    return this.blockchainService.accountData.blooms.length;
  }

  get minted(): any {
    if (!this.blockchainService || !this.blockchainService.blooms) {
      return 0;
    }
    return this.blockchainService.blooms.length;
  }
}
