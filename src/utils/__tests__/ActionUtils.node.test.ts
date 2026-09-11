import { describe, expect, test, vi } from 'vitest';

import { showBulkAction } from '../ActionUtils';

import * as UI from '@/types/ui';

interface TestItem {
  id: number;
}

interface TestEntity {
  id: number;
  user?: { flags: string[] };
}

const session = {
  user: {
    permissions: ['admin'],
  },
} as unknown as UI.AuthenticatedSession;

const items: TestItem[] = [{ id: 1 }, { id: 2 }];

const createAction = (
  overrides: Partial<UI.ActionDefinition<TestItem, TestEntity>> = {},
): UI.ActionDefinition<TestItem, TestEntity> => ({
  id: 'test',
  displayName: 'Test',
  handler: vi.fn(),
  bulk: { enabled: true },
  ...overrides,
});

const ownEntity: TestEntity = { id: 1, user: { flags: ['self'] } };
const otherEntity: TestEntity = { id: 2, user: { flags: ['asch'] } };

describe('showBulkAction', () => {
  test('hides actions that do not opt in to bulk', () => {
    const action = createAction({ bulk: undefined });
    expect(showBulkAction(action, items, otherEntity, session)).toBe(false);
  });

  test('shows a bulk-enabled action with no filters', () => {
    expect(showBulkAction(createAction(), items, otherEntity, session)).toBe(true);
  });

  test('respects maxItems', () => {
    const action = createAction({ bulk: { enabled: true, maxItems: 1 } });
    expect(showBulkAction(action, items, otherEntity, session)).toBe(false);
  });

  describe('entity', () => {
    test('passes the entity to the bulk filter', () => {
      const filter = vi.fn(() => true);
      const action = createAction({ bulk: { enabled: true, filter } });

      showBulkAction(action, items, otherEntity, session);

      expect(filter).toHaveBeenCalledWith({ itemData: items, entity: otherEntity });
    });

    test('passes the entity to the single-item filter fallback', () => {
      const filter = vi.fn(() => true);
      const action = createAction({ filter });

      showBulkAction(action, items, otherEntity, session);

      expect(filter).toHaveBeenCalledWith({ itemData: items[0], entity: otherEntity });
    });

    test('lets a bulk filter hide the action based on the entity', () => {
      // The case this exists for: downloading from your own filelist
      const filter = ({ entity }: UI.FilterData<TestItem[], TestEntity>) =>
        !entity?.user?.flags.includes('self');
      const action = createAction({ bulk: { enabled: true, filter } });

      expect(showBulkAction(action, items, otherEntity, session)).toBe(true);
      expect(showBulkAction(action, items, ownEntity, session)).toBe(false);
    });
  });

  describe('single-item filter fallback', () => {
    test('requires every item to pass', () => {
      const action = createAction({
        filter: ({ itemData }) => itemData.id === 1,
      });

      expect(showBulkAction(action, items, otherEntity, session)).toBe(false);
      expect(showBulkAction(action, [items[0]], otherEntity, session)).toBe(true);
    });

    test('prefers the bulk filter when both are present', () => {
      const singleFilter = vi.fn(() => false);
      const action = createAction({
        filter: singleFilter,
        bulk: { enabled: true, filter: () => true },
      });

      expect(showBulkAction(action, items, otherEntity, session)).toBe(true);
      expect(singleFilter).not.toHaveBeenCalled();
    });
  });
});
