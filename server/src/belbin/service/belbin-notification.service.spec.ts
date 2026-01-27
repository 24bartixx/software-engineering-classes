import { Test, TestingModule } from '@nestjs/testing';
import { BelbinNotificationService } from './belbin-notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { NotificationSending } from '../entities/notification-sending.entity';
import { EmailService } from '../../common/email.service';
import { SystemConfigService } from '../../system-config/system-config.service';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException } from "@nestjs/common";

describe('BelbinNotificationService', () => {
  let service: BelbinNotificationService;
  let notificationRepo: jest.Mocked<Repository<Notification>>;
  let notificationSendingRepo: jest.Mocked<Repository<NotificationSending>>;
  let systemConfigService: { getOrThrow: jest.Mock };
  let emailService: { sendExpiredTestNotification: jest.Mock };
  let entityManager: { findOne: jest.Mock; create: jest.Mock; save: jest.Mock; };

  const mockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BelbinNotificationService,
        { provide: getRepositoryToken(Notification), useValue: mockRepository() },
        { provide: getRepositoryToken(NotificationSending), useValue: mockRepository() },
        {
          provide: EmailService,
          useValue: {
            sendExpiredTestNotification: jest.fn(),
          },
        },
        {
          provide: SystemConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn().mockImplementation((cb) => {
              return cb(entityManager);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BelbinNotificationService>(BelbinNotificationService);
    notificationRepo = module.get(getRepositoryToken(Notification));
    notificationSendingRepo = module.get(getRepositoryToken(NotificationSending));
    systemConfigService = module.get(SystemConfigService);
    emailService = module.get(EmailService);
    entityManager = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReminderBlockedMap', () => {

    it('should return false (no block) when user has not received notification at all or not recently', async () => {
      // ARRANGE
      const userId = 1;
      notificationSendingRepo.find.mockReturnValue([] as any);

      // ACT
      const result = await service.getReminderBlockedMap([userId]);

      // ASSERT
      expect(result.get(userId)).toBe(false);
    });

    it('should return true (blocker) when user has received notification recently', async () => {
      // ARRANGE
      const userId = 1;
      notificationSendingRepo.find.mockReturnValue([{ userId: userId }] as any);

      // ACT
      const result = await service.getReminderBlockedMap([userId]);

      // ASSERT
      expect(result.get(userId)).toBe(true);
    });
  });

  describe('sendReminder', () => {
    it('should return bad request when sending notification to blocked user', async () => {
      // ARRANGE
      const userId = 1;
      const mockEmployee = {user: {user_id: userId, email: 'test@example.com'}} as any;

      notificationSendingRepo.find.mockReturnValue([{ userId: userId }] as any);

      // ACT & ASSERT
      await expect(service.sendReminder(mockEmployee, new Date()))
        .rejects
        .toThrow(BadRequestException)

      expect(emailService.sendExpiredTestNotification).not.toHaveBeenCalled();
    });

    it('should send notification when user is not blocked', async () => {
      // ARRANGE
      const email = 'ok@example.com'
      const mockEmployee = {user: {user_id: 4, email: email}} as any;
      notificationSendingRepo.find.mockReturnValue([] as any);

      const mockNotification = {
        id: 1,
        title: 'Expired-Belbin',
        type: 'Mail',
      };
      const emailTitle = 'Expired Title';
      const expirationDate = new Date();

      systemConfigService.getOrThrow.mockReturnValue(emailTitle);
      entityManager.findOne.mockReturnValue(mockNotification);

      // ACT
      await service.sendReminder(mockEmployee, expirationDate);

      // ASSERT
      expect(emailService.sendExpiredTestNotification).toHaveBeenCalledWith(email, emailTitle, expirationDate.toLocaleDateString());
    });
  });
});
