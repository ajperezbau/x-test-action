import { withModule } from '../../wiring/wires.factory';
import { createWiring } from '../../wiring/wiring.utils';

/**
 * The next queries wire factory.
 *
 * @public
 */
export const nextQueriesModule = withModule('nextQueries');

/**
 * Sets the next queries state `query`.
 *
 * @public
 */
export const setNextQueriesQuery = nextQueriesModule.wireCommit('setQuery');

/**
 * Requests and stores the next queries.
 *
 * @public
 */
export const getAndSaveNextQueries = nextQueriesModule.wireDispatchWithoutPayload(
  'getAndSaveNextQueries'
);

/**
 * Sets the next queries state `query` with the last query in history queries.
 *
 * @public
 */
export const setQueryFromLastHistoryQuery = nextQueriesModule.wireDispatch(
  'setQueryFromLastHistoryQuery'
);

/**
 * Sets the next queries state `searchedQueries` with the list of history queries.
 *
 * @public
 */
export const setSearchedQueries = nextQueriesModule.wireCommit('setSearchedQueries');

/**
 * Wiring configuration for the {@link NextQueriesXModule | next queries module}.
 *
 * @internal
 */
export const nextQueriesWiring = createWiring({
  UserAcceptedAQuery: {
    setNextQueriesQuery
  },
  SessionHistoryQueriesChanged: {
    setSearchedQueries,
    // TODO setQueryFromLastHistoryQuery it has to be called only one time
    setQueryFromLastHistoryQuery
  },
  NextQueriesRequestChanged: {
    getAndSaveNextQueries
  }
});
