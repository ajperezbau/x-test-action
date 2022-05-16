import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Suggestion } from '@empathyco/x-types';
import { getPopularSearchesStub } from '../../../../__stubs__/popular-searches-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import PopularSearches from '../popular-searches.vue';
import PopularSearch from '../popular-search.vue';
import { resetXPopularSearchesStateWith } from './utils';

const popularSearches = getPopularSearchesStub();

const localVue = createLocalVue();
localVue.use(Vuex);

const store: Store<DeepPartial<RootXStoreState>> = new Store({});

installNewXPlugin({ store }, localVue);

function findTestDataById(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
  return wrapper.findAll(getDataTestSelector(testDataId));
}

function renderPopularSearches({
  customSlot = '',
  template = `<PopularSearches
                :maxItemsToRender="maxItemsToRender"
                :showFacets="showFacets"
                :appendSuggestionWithoutFilter="appendSuggestionWithoutFilter">
                ${customSlot}
              </PopularSearches>`,
  suggestions = getPopularSearchesStub(),
  maxItemsToRender = undefined,
  showFacets = false,
  appendSuggestionWithoutFilter = false
}: PopularSearchesOptions = {}): PopularSearchesAPI {
  resetXPopularSearchesStateWith(store, { popularSearches: suggestions });

  const wrapper = mount(
    {
      template,
      components: {
        PopularSearches,
        PopularSearch
      },
      props: ['maxItemsToRender', 'showFacets', 'appendSuggestionWithoutFilter']
    },
    {
      localVue,
      store,
      propsData: {
        suggestions,
        maxItemsToRender,
        showFacets,
        appendSuggestionWithoutFilter
      }
    }
  );

  return {
    wrapper: wrapper.findComponent(PopularSearches),
    suggestions,
    localVue,
    findTestDataById: findTestDataById.bind(null, wrapper)
  };
}

describe('testing popular searches component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderPopularSearches();
    expect(isXComponent(wrapper.vm)).toBe(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('popularSearches');
  });

  it('renders a button with the query of the popular search (suggestion)', () => {
    const { findTestDataById } = renderPopularSearches();
    const eventButtonsList = findTestDataById('popular-search');

    popularSearches.forEach((suggestion, index) => {
      expect(eventButtonsList.at(index).element.innerHTML).toContain(suggestion.query);
    });
  });

  it('renders a span & and image overriding the default Popular Search content', () => {
    const customSlot = `<template #suggestion-content="suggestionContentScope">
            <img src="./popular-search-icon.svg" class="x-popular-search__icon" data-test="icon"/>
            <span class="x-popular-search__query" :data-index="suggestionContentScope.index"
                data-test="query">{{ suggestionContentScope.suggestion.query }}</span>
        </template>`;
    const { findTestDataById } = renderPopularSearches({ customSlot });
    const eventSpansList = findTestDataById('query');
    const iconsList = findTestDataById('icon');
    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
    });
  });

  it('renders a button & a custom Popular Search', () => {
    const customSlot = `<template #suggestion="{suggestion}">
        <PopularSearch :suggestion="suggestion">
          <template #default="{suggestion}">
            <img src="./popular-search-icon.svg"
                 class="x-popular-search__icon"
                 data-test="icon"/>
            <span class="x-popular-search__query"
                  data-test="query">{{ suggestion.query }}</span>
          </template>
        </PopularSearch>
        <button data-test="custom-button">Custom Behaviour</button>
      </template>`;
    const { wrapper } = renderPopularSearches({ customSlot });
    expect(wrapper.findComponent(PopularSearch)).toBeDefined();

    const eventSpansList = findTestDataById(wrapper, 'query');
    const iconsList = findTestDataById(wrapper, 'icon');
    const customButtonList = findTestDataById(wrapper, 'custom-button');

    popularSearches.forEach((suggestion, index) => {
      expect(eventSpansList.at(index).element.innerHTML).toEqual(suggestion.query);
      expect(iconsList.at(index)).toBeDefined();
      expect(customButtonList.at(index)).toBeDefined();
    });
  });

  it('does not render any PopularSearch if the are none', () => {
    const { wrapper } = renderPopularSearches({ suggestions: [] });
    expect(wrapper.html()).toBe('');
  });

  it('renders at most the number of PopularSearch defined by `maxItemsToRender` prop', async () => {
    const { wrapper, findTestDataById } = renderPopularSearches();
    const renderedPopularSearches = (): WrapperArray<Vue> => findTestDataById('popular-search');

    await wrapper.setProps({ maxItemsToRender: 2 });
    expect(renderedPopularSearches()).toHaveLength(2);

    await wrapper.setProps({ maxItemsToRender: 3 });
    expect(renderedPopularSearches()).toHaveLength(3);

    await wrapper.setProps({ maxItemsToRender: 5 });
    expect(renderedPopularSearches()).toHaveLength(popularSearches.length);
  });
});

/**
 * The options for the `renderPopularSearches` function.
 */
interface PopularSearchesOptions {
  customSlot?: string;
  template?: string;
  suggestions?: Suggestion[];
  maxItemsToRender?: number;
  showFacets?: boolean;
  appendSuggestionWithoutFilter?: boolean;
}

/**
 * Test API for the {@link  PopularSearches} component.
 */
interface PopularSearchesAPI {
  wrapper: Wrapper<Vue>;
  suggestions: Suggestion[];
  findTestDataById: (testDataId: string) => WrapperArray<Vue>;
  localVue: typeof Vue;
}
