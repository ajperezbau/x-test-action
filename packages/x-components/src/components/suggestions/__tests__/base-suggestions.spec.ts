import { BooleanFilter, Suggestion } from '@empathyco/x-types';
import { mount, WrapperArray, Wrapper } from '@vue/test-utils';
import { getPopularSearchesStub } from '../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseSuggestions from '../base-suggestions.vue';
import { createSuggestionWithFacets } from '../../../__stubs__/base-suggestion-stubs.factory';

const suggestionWithFacets = createSuggestionWithFacets('testQuery', 'testQuery', 'PopularSearch');

function renderBaseSuggestions({
  customSlot = '',
  template = `<BaseSuggestions
                :suggestions="suggestions"
                :showFacets="showFacets"
                :appendSuggestionWithoutFilter="appendSuggestionWithoutFilter">
                  <template #default="{suggestion, index}">
                    ${customSlot ?? ''}
                  </template>
                </BaseSuggestions>`,
  suggestions = getPopularSearchesStub(),
  showFacets = false,
  appendSuggestionWithoutFilter = false
}: BaseSuggestionsOptions = {}): BaseSuggestionsAPI {
  const wrapper = mount(
    {
      template,
      components: {
        BaseSuggestions
      },
      props: ['suggestions', 'showFacets', 'appendSuggestionWithoutFilter']
    },
    {
      propsData: { suggestions, showFacets, appendSuggestionWithoutFilter }
    }
  );

  return {
    wrapper: wrapper.findComponent(BaseSuggestions),
    suggestions,
    getSuggestionsItems() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'));
    }
  };
}

describe('testing Base Suggestions component', () => {
  it('renders a list of suggestions passed as props', () => {
    const { wrapper, suggestions, getSuggestionsItems } = renderBaseSuggestions();

    expect(getSuggestionsItems()).toHaveLength(suggestions.length);
    // Expect generated keys to be unique
    const listItemKeys = new Set((wrapper.vm as any).suggestionsKeys);
    expect(listItemKeys.size).toEqual(suggestions.length);
  });

  it('has a default scoped slot to render each suggestion', () => {
    const { suggestions, getSuggestionsItems } = renderBaseSuggestions({
      customSlot: '<span>{{ index }} - {{ suggestion.query}}</span>'
    });
    getSuggestionsItems().wrappers.forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toEqual(`${index} - ${suggestions[index].query}`)
    );
  });

  it('renders at most the number of suggestions defined by `maxItemsToRender` prop', async () => {
    const { wrapper, getSuggestionsItems, suggestions } = renderBaseSuggestions();

    expect(getSuggestionsItems()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length - 1 });
    expect(getSuggestionsItems()).toHaveLength(suggestions.length - 1);

    await wrapper.setProps({ maxItemsToRender: suggestions.length });
    expect(getSuggestionsItems()).toHaveLength(suggestions.length);

    await wrapper.setProps({ maxItemsToRender: suggestions.length + 1 });
    expect(getSuggestionsItems()).toHaveLength(suggestions.length);
  });

  it('renders all suggestions with facets if showFacets is true', () => {
    const { getSuggestionsItems } = renderBaseSuggestions({
      customSlot:
        '<span>{{ suggestion.query }} - {{ suggestion.facets[0].filters[0].label }}</span>',
      showFacets: true,
      suggestions: suggestionWithFacets
    });
    expect(getSuggestionsItems()).toHaveLength(3);

    const filters = getFlattenFilters();

    getSuggestionsItems().wrappers.forEach((suggestionItemWrapper, index) =>
      expect(suggestionItemWrapper.text()).toBe(
        `${suggestionWithFacets[0].query} - ${filters[index]}`
      )
    );
  });

  it("won't render suggestions with facets if showFacets is false", () => {
    const { getSuggestionsItems } = renderBaseSuggestions({
      customSlot: '<span>{{ suggestion.query }}{{ suggestion.facets[0] }}</span>',
      showFacets: false,
      suggestions: suggestionWithFacets
    });

    expect(getSuggestionsItems()).toHaveLength(1);
    getSuggestionsItems().wrappers.forEach(suggestionItemWrapper =>
      expect(suggestionItemWrapper.text()).toBe(suggestionWithFacets[0].query)
    );
  });

  it('shows the suggestions with facets and the query itself', () => {
    const { getSuggestionsItems } = renderBaseSuggestions({
      customSlot: '<span>{{ suggestion.query }}{{ suggestion.facets[0]?.filters[0].label }}</span>',
      showFacets: true,
      appendSuggestionWithoutFilter: true,
      suggestions: suggestionWithFacets
    });
    expect(getSuggestionsItems()).toHaveLength(4);
    expect(getSuggestionsItems().wrappers[0].text()).toBe(suggestionWithFacets[0].query);

    const filters = getFlattenFilters();
    getSuggestionsItems().wrappers.forEach((suggestionItemWrapper, index) => {
      if (index === 0) {
        expect(suggestionItemWrapper.text()).toBe(suggestionWithFacets[0].query);
      } else {
        expect(suggestionItemWrapper.text()).toBe(
          `${suggestionWithFacets[0].query}${filters[index - 1]}`
        );
      }
    });
  });

  function getFlattenFilters(): string[] {
    const filters: string[] = [];
    suggestionWithFacets[0].facets.forEach(facet => {
      for (let i = 0; i < facet.filters.length; i++) {
        filters.push((facet.filters[i] as BooleanFilter).label);
      }
    });
    return filters;
  }
});

/**
 * The options for the `renderBaseSuggestions` function.
 */
interface BaseSuggestionsOptions {
  template?: string;
  suggestions?: Suggestion[];
  showFacets?: boolean;
  appendSuggestionWithoutFilter?: boolean;
  customSlot?: string;
}

/**
 * Test API for the {@link BaseSuggestions} component.
 */
interface BaseSuggestionsAPI {
  wrapper: Wrapper<Vue>;
  suggestions: Suggestion[];
  getSuggestionsItems: () => WrapperArray<Vue>;
}
