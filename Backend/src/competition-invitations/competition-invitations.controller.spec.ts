import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionInvitationsController } from './competition-invitations.controller';
import { CompetitionInvitationsService } from './competition-invitations.service';

describe('CompetitionInvitationsController', () => {
  let controller: CompetitionInvitationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionInvitationsController],
      providers: [CompetitionInvitationsService],
    }).compile();

    controller = module.get<CompetitionInvitationsController>(CompetitionInvitationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
