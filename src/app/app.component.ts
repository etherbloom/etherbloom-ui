import { Component } from '@angular/core';
import { BlockchainService } from './services/blockchain.service'

declare global {
  interface Window {
    blockchain: BlockchainService;
    ethereum: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'etherbloom';
  constructor(public blockchainService: BlockchainService) {
    window.blockchain = blockchainService;
  }
}
