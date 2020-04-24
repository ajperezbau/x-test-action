import { HistoryQuery } from '@empathy/search-types';
import { createLocalVue, mount } from '@vue/test-utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../__tests__/adapter.dummy';
import RemoveHistoryQuery from '../remove-history-query.vue';

describe('testing RemoveHistoryQuery component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });
  const historyQuery: HistoryQuery = {
    modelName: 'HistoryQuery',
    query: 'Saltiquinos',
    timestamp: 778394
  };

  it('emits UserPressedRemoveHistoryQuery when it is clicked', () => {
    const listener = jest.fn();

    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      localVue,
      propsData: {
        historyQuery
      }
    });
    removeHistoryQuery.vm.$x.on('UserPressedRemoveHistoryQuery', true).subscribe(listener);

    removeHistoryQuery.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery,
      metadata: {
        moduleName: 'historyQueries',
        target: removeHistoryQuery.element
      }
    });
  });

  it('has a default slot with a default message', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      localVue,
      propsData: {
        historyQuery
      }
    });

    expect(removeHistoryQuery.element.textContent).toEqual(
      removeHistoryQuery.vm.$x.config.messages.historyQueries.removeHistoryQuery.content
    );
  });

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-remove-history-query__text">Remove</span>';
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      localVue,
      slots: {
        default: {
          template: slotTemplate
        }
      },
      propsData: {
        historyQuery
      }
    });
    const renderedSlotHTML = removeHistoryQuery.element.querySelector(
      '.x-remove-history-query__text'
    );

    expect(renderedSlotHTML).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(renderedSlotHTML!.textContent).toEqual('Remove');
  });
});