import {Injectable} from '@angular/core';
import {BigNumber, Contract, providers, utils} from 'ethers';
import {Network} from '@ethersproject/networks';
import {Web3Provider} from '@ethersproject/providers';
import swal from 'sweetalert2';
import Web3Modal from 'web3modal';

import { TokenSale } from '../../../../types/TokenSale';
import {BloomERC721} from '../../../../types/BloomERC721';
import {Web3ModalService} from '@mindsorg/web3modal-angular';
import { IndexerService } from './indexer.service';

export const networks: {
  name: {[id: string]: string};
  coin: {[id: string]: string};
} = {
  name: {
    '1': 'Ether',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '5': 'Goerli',
    '42': 'Kovan',
    '56': 'Binance',
    '77': 'Sokol',
    '97': 'bsctest',
    '99': 'POA',
    '137': 'Poly',
    '250': 'Fantom',
    '1337': 'Local',
    '4002': 'Fantomtest',
    '5700': 'Ssycoin',
    '43113': 'Fuji',
    '43114': 'Ava',
  },
  coin: {
    '1': 'ETH',
    '3': 'rETH',
    '4': 'rETH',
    '5': 'kETH',
    '42': 'kETH',
    '56': 'BNB',
    '77': 'sPOS',
    '97': 'tBNB',
    '99': 'POA',
    '137': 'MATIC',
    '250': 'FTM',
    '1337': 'lETH',
    '4002': 'tFTM',
    '5700': 'SYS',
    '43113': 'tAVAX',
    '43114': 'AVAX',
  },
};

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {

  ethers: providers.Web3Provider | undefined;
  provider: providers.Web3Provider | null = null;
  account: string | undefined;
  signer: providers.JsonRpcSigner | undefined;
  public networks = networks;
  network: Network | null = null;
  public networkId = 0;
  public connected = false;
  public isLoading = false;
  public isOpen = false;
  web3Modal: Web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions: {},
    theme: {
      background: 'rgb(39, 49, 56)',
      main: 'rgb(199, 199, 199)',
      secondary: 'rgb(136, 136, 136)',
      border: 'rgba(195, 195, 195, 0.14)',
      hover: 'rgb(16, 26, 32)',
    },
  });

  contractData: any;
  accountData: any;
  tokenSale: any;
  token: any;

  public totalMinted: number = 0;

  public blooms: any;
  public seeds: any
  public salePrice: any;

  constructor(private web3modalService: Web3ModalService, private indexerService: IndexerService) {
    this.connectAccount = this.connectAccount.bind(this);
    this.reloadAccount = this.reloadAccount.bind(this);
    this.resetApp = this.resetApp.bind(this);
    this.setupAccount = this.setupAccount.bind(this);

    this.seeds = {};
    this.loadData();
  }

  // show an invalid network message for error cases
  networkError(e:Error) {
    swal.fire({
      title: 'Network Error',
      text: 'Etherbloom has experienced a network error: ' + e.message,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-info retro-confirm',
      },
    });
  };

  async connectAccount(): Promise<void> {
    this.resetApp();
    const externalProvider: providers.ExternalProvider =
      await this.web3Modal.connect();
    if (externalProvider) {
      const web3Provider = new providers.Web3Provider(externalProvider);
      try {
        await this.setupAccount(web3Provider);
        await this.subscribeProvider(web3Provider);
        this.provider = web3Provider;
        this.loadData();
        this.loadAccountData();
      } catch (e: any) {
        this.networkError(e);
      }
    }
  }

  async reloadAccount(): Promise<void> {
    if (this.web3Modal && this.web3Modal.cachedProvider) {
      const externalProvider: providers.ExternalProvider =
        await this.web3Modal.connect();
      const web3Provider = new providers.Web3Provider(externalProvider);
      try {
        await this.setupAccount(web3Provider);
        await this.subscribeProvider(web3Provider);
        this.provider = web3Provider;
        this.loadData();
        this.loadAccountData();
      } catch (e: any) {
        this.networkError(e);
      }
    }
  }


  resetApp(): void {
    if (this.provider) {
      this.provider = null;
    }
    this.web3modalService.clearCachedProvider();
  }

  async subscribeProvider(provider: providers.Web3Provider): Promise<void> {
    if (!provider.on) {
      return;
    }
    provider.on('close', async () => this.resetApp());
    provider.on('accountsChanged', async (accounts: string[]) => {
      console.log('accountsChanged', accounts);
      return await this.reloadAccount();
    });
    provider.on('chainChanged', async (chainId: number) => {
      console.log('chainChanged', chainId);
      return await this.reloadAccount();
    });

    provider.on('networkChanged', async (networkId: number) => {
      console.log('networkChanged', networkId);
      return await this.reloadAccount();
    });
  }

  async setupAccount(provider: Web3Provider): Promise<void> {

    this.provider = provider;
    if (!this.provider) {
      throw new Error('no provider for blockchain service')
    }

    this.signer = this.provider.getSigner();
    if (!this.signer) {
      throw new Error('no signer for blockchain service')
    }

    const [account, network] = await Promise.all([
      this.signer.getAddress(),
      this.provider.getNetwork(),
    ]);
    if (!account) {
      throw new Error('no account for blockchain service')
    }
    this.account = account;

    if (!network) {
      throw new Error('no network for blockchain service')
    }
    this.network = network;
    this.networkId = this.network.chainId;

    try {
      this.contractData = await import(`../../../abis/${this.networkId}/abis.json`);
    } catch (e: any) {
      return this.networkError(e);
    }

    const [tokenSale, token] =
      await Promise.all([
        this.getContractRef('TokenSale'),
        this.getContractRef('BloomERC721'),
      ]);

    // the token sale
    this.tokenSale = tokenSale as TokenSale;

    // the token
    this.token = token as BloomERC721;

    // setup token events
    await this.setupEvents();

    this.isOpen = await this.tokenSale.getOpenState();

    this.connected = true;
  }

  async setupEvents() {
    this.tokenSale.on(
      'TokenMinted',
      async (
        receiver: string,
        tokenHash: BigNumber,
        seed: string
      ) => {
        this.totalMinted++;
        this.blooms.push({
          tokenHash,
          receiver
        })
        if (receiver !== this.account) {
          return;
        }
        swal.fire({
          title: 'Purchase Confirmed',
          text: 'Your Etherbloom purchase has been confirmed and your Etherbloom has arrived. Thank you for your purchase. The Holders section is now open to you.',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-info retro-confirm',
          },
        });
      }
    );
  }

  loadData() {
    this.indexerService.fetch('blooms').then((blooms: any) => {
      this.blooms = Object.values(blooms).reverse();
      this.blooms.forEach((bloom: any) => this.seeds[bloom.seed] = true);
    });
  }

  loadAccountData() {
    if (!this.account) {
      return;
    }
    this.indexerService._fetch(`/q/${this.account}`).then((accountData: any) => {
      this.accountData = Object.values(accountData).reverse();
    });
    this.tokenSale.getSalePrice().then((sp:BigNumber) => this.salePrice = sp);
  }

  async transferBloom(bloomHash: string): Promise<void> {
    if (this.token && this.account) {
      const tokenRef = this.token;
      const myAccount = this.account;
      swal
        .fire({
          title: 'Transfer Bloom',
          html: `<input type="text" id="recipient" class="swal2-input" placeholder="recipient address">`,
          confirmButtonText: 'Transfer',
          focusConfirm: false,
          preConfirm: () => {
            let recipient: any = swal.getPopup();
            recipient = recipient ? recipient.querySelector('#recipient') : null;
            recipient = recipient ? recipient.value : null;
            if (!recipient) {
              swal.showValidationMessage(`Please enter an address`);
            }
            return {recipient, quantity: 1};
          },
        })
        .then(async (result: any) => {
          if (!result.value) {
            console.log('no recipient address given');
            return;
          }
          await tokenRef.transferFrom(
            myAccount,
            result.value.recipient,
            bloomHash
          );
          swal.fire('Bloom sent');
        });
    }
  }


  async getContractRef(
    contract: string,
    address?: string,
  ): Promise<Contract> {
    const tokenData = this.contractData.contracts[contract];
    if (!tokenData.abi) {
      tokenData.abi = await require(`../../../abis/${contract}.json`);
      if (!tokenData.abi) throw new Error(`abi not found for ${contract}`);
    }
    // if theres a cached contract then return it
    if (tokenData && tokenData.__contract) return tokenData.__contract;
    // create a new contract f
    tokenData.__contract = new Contract(
      address ? address : tokenData.address,
      tokenData.abi,
      this.signer
    );
    // cache it
    this.contractData.contracts[contract] = tokenData;
    // return it
    return tokenData.__contract;
  }

  async getBloomPrice(): Promise<BigNumber> {
    return await this.tokenSale.getSalePrice();
  }

  async getOpenState(): Promise<boolean> {
    return await this.tokenSale.getOpenState();
  }

  async getNumberSold(): Promise<number> {
    return 0;
  }

  async purchaseBloom(seed: string): Promise<any> {
    const bloomPrice = await this.getBloomPrice();
    const openState = this.getOpenState();
    seed = seed.toLowerCase().trim();
    if (!bloomPrice || bloomPrice.eq(0)) {
      return console.log('no price!');
    }
    if (!openState) {
      return swal.fire({
        title: 'Token Sale Closed',
        text: 'The token sale is closed and has either not started yet, or all items have been sold.',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-info retro-confirm',
        },
      });
    }
    await this.tokenSale.purchase(this.account, seed, { value: bloomPrice });
    swal.fire({
      title: 'Purchase Submitted',
      text: 'Your Etherbloom purchase has been submitted. You\'ll receive your Etherbloom in just a moment.',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-info retro-confirm',
      },
    });
  }
}
