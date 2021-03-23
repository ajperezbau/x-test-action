import { SearchXStoreModule } from '../types';

/**
 * Default implementation for the {@link SearchGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the search
 * module.
 * @returns The search request to fetch data from the API.
 *
 * @public
 */
export const request: SearchXStoreModule['getters']['request'] = ({
  query,
  config,
  relatedTags,
  selectedFilters,
  sort
}) => {
  return query.trim()
    ? {
        query,
        relatedTags,
        sort,
        rows: config.maxItemsToRequest,
        start: 0,
        origin: 'default',
        filters: selectedFilters
      }
    : null;
};
