import {
  namespacedWireCommit,
  namespacedWireDispatchWithoutPayload
} from '../../wiring/namespaced-wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * `search` {@link XModuleName | XModule name}.
 *
 * @internal
 */
const moduleName = 'search';
/**
 * WireCommit for {@link SearchXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit(moduleName);

/**
 * WireDispatchWithoutPayload for {@link SearchXModule}.
 *
 * @internal
 */
const wireDispatchWithoutPayload = namespacedWireDispatchWithoutPayload(moduleName);

/**
 * Sets the search state `query`.
 *
 * @public
 */
export const setSearchQuery = wireCommit('setQuery');

/**
 * Sets the search state `relatedTags`.
 *
 * @public
 */
export const setRelatedTags = wireCommit('setRelatedTags');

/**
 * Sets the search state `selectedFilters`.
 *
 * @public
 */
export const setSelectedFilters = wireCommit('setSelectedFilters');

/**
 * Requests and stores the search response.
 *
 * @public
 */
export const fetchAndSaveSearchResponse = wireDispatchWithoutPayload('fetchAndSaveSearchResponse');

/**
 * Search wiring.
 *
 * @internal
 */
export const searchWiring = createWiring({
  UserAcceptedAQuery: {
    setSearchQuery
  },
  UserClearedQuery: {
    setSearchQuery
  },
  SearchRequestChanged: {
    fetchAndSaveSearchResponse
  },
  SelectedRelatedTagsChanged: {
    setRelatedTags
  },
  SelectedFiltersChanged: {
    setSelectedFilters
  }
});