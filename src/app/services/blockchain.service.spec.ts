import { TestBed } from '@angular/core/testing';

import { BlockchainService } from './blockchain.service';

describe('BlockchainServiceService', () => {
  let service: BlockchainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockchainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
