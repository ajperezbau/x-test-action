import { BooleanFilter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getXComponentXModuleName, isXComponent } from '../../../../../components';
import { XEventsTypes } from '../../../../../wiring/events.types';
import { getSimpleFilterStub } from '../../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../../__tests__/utils';
import BaseFilter from '../base-filter.vue';

function renderBaseFilter({
  template = '<BaseFilter :filter="filter" :clickEvents="clickEvents"/>',
  filter = getSimpleFilterStub(),
  clickEvents
}: RenderBaseFilterOptions = {}): BaseFilterAPI {
  Vue.observable(filter);
  const emit = jest.fn();
  const wrapper = mount(
    {
      components: { BaseFilter },
      props: ['filter', 'clickEvents'],
      template
    },
    {
      propsData: {
        filter,
        clickEvents
      },
      mocks: {
        $x: {
          emit
        }
      }
    }
  );

  const baseFilterWrapper = wrapper.findComponent(BaseFilter);

  return {
    wrapper,
    baseFilterWrapper,
    emit,
    filter,
    clickFilter() {
      wrapper.trigger('click');
    },
    selectFilter() {
      filter.selected = true;
      return Vue.nextTick();
    }
  };
}

describe('testing Filter component', () => {
  it('is an x-component', () => {
    const { baseFilterWrapper } = renderBaseFilter();

    expect(isXComponent(baseFilterWrapper.vm)).toEqual(true);
  });

  it('belongs to the `facets` x-module', () => {
    const { baseFilterWrapper } = renderBaseFilter();

    expect(getXComponentXModuleName(baseFilterWrapper.vm)).toEqual('facets');
  });

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = renderBaseFilter();

    expect(wrapper.text()).toEqual(filter.label);
  });

  it('emits UserClickedAFilter when clicked', () => {
    const { wrapper, clickFilter, emit, filter } = renderBaseFilter();

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: wrapper.element
    });
  });

  it('emits UserClickedAFilter and other custom events when clicked', () => {
    const filter = getSimpleFilterStub();
    const { wrapper, clickFilter, emit } = renderBaseFilter({
      filter,
      clickEvents: {
        UserClickedASimpleFilter: filter
      }
    });

    clickFilter();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith('UserClickedAFilter', filter, {
      target: wrapper.element
    });
    expect(emit).toHaveBeenCalledWith('UserClickedASimpleFilter', filter, {
      target: wrapper.element
    });
  });

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = renderBaseFilter({
      template: `
      <BaseFilter :filter="filter" v-slot="{ filter }">
        <span data-test="custom-label">{{ filter.label }}</span>
      </BaseFilter>
      `
    });

    const customLabel = wrapper.find(getDataTestSelector('custom-label'));
    expect(customLabel.text()).toEqual(filter.label);
  });

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { wrapper, selectFilter } = renderBaseFilter();

    expect(wrapper.classes()).not.toContain('x-filter--is-selected');

    await selectFilter();

    expect(wrapper.classes()).toContain('x-filter--is-selected');
  });
});

interface RenderBaseFilterOptions {
  template?: string;
  filter?: BooleanFilter;
  clickEvents?: Partial<XEventsTypes>;
}

interface BaseFilterAPI {
  wrapper: Wrapper<Vue>;
  baseFilterWrapper: Wrapper<Vue>;
  emit: jest.Mock;
  filter: BooleanFilter;
  clickFilter: () => void;
  selectFilter: () => Promise<void>;
}