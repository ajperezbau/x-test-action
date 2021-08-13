import { SimpleFilter, isSimpleFilter } from '@empathyco/x-types-next';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../store/store.types';
import { FilterEntity } from './types';

/**
 * Allows selecting and deselecting a filter of {@link SimpleFilter}.
 */
export class SimpleFilterEntity implements FilterEntity {
  public static accepts = isSimpleFilter;

  public constructor(protected store: Store<RootXStoreState>) {}

  /**
   * Deselects and saves to the store the given filter.
   *
   * @param filter - The filter to deselect.
   */
  deselect(filter: SimpleFilter): void {
    this.store.commit('x/facetsNext/setFilter', { ...filter, selected: false });
  }

  /**
   * Selects and saves to the store the given filter.
   *
   * @param filter - The filter to select.
   */
  select(filter: SimpleFilter): void {
    this.store.commit('x/facetsNext/setFilter', { ...filter, selected: true });
  }
}