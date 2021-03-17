import { Facet, Filter, isHierarchicalFacet } from '@empathy/search-types';
import { arrayToObject, deepFlat, reduce } from '../../../../utils';
import { FacetsXStoreModule } from '../types';

/**
 * Default implementation for the {@link FacetsGetters.flattenedFilters} getter.
 *
 * @param _state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the facets
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * facets.
 *
 * @returns Array of filters.
 *
 * @public
 */
export const flattenedFilters: FacetsXStoreModule['getters']['flattenedFilters'] = (
  _state,
  getters
) => {
  return reduce(getters.facets, extractFilters, {} as Record<Filter['id'], Filter>);
};

/**
 * It returns a filters object which contains facet's filters at the same depth level.
 *
 * @param filtersMap - Accumulator object.
 * @param _facetName - Not used facet object key.
 * @param facet - Current facet object.
 * @returns Facet's filters object at the same depth level.
 */
function extractFilters(
  filtersMap: Record<Filter['id'], Filter>,
  _facetName: string | number,
  facet: Facet
): Record<Filter['id'], Filter> {
  const filters = isHierarchicalFacet(facet) ? deepFlat(facet.filters, 'children') : facet.filters;
  return Object.assign(filtersMap, arrayToObject(filters, 'id'));
}