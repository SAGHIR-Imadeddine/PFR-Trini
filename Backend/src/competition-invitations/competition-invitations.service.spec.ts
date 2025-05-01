import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionInvitationsService } from './competition-invitations.service';

describe('CompetitionInvitationsService', () => {
  let service: CompetitionInvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetitionInvitationsService],
    }).compile();

    service = module.get<CompetitionInvitationsService>(CompetitionInvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
