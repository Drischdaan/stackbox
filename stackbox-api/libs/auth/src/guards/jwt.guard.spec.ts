import { TestBed } from '@automock/jest';
import { JwtGuard } from './jwt.guard';

describe('JwtGuard', () => {
  let guard: JwtGuard;

  beforeEach(() => {
    const { unit } = TestBed.create(JwtGuard).compile();

    guard = unit;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
