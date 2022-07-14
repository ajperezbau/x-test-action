import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { historyQueriesXModule } from '../../x-module';
import HistoryQueriesSwitch from '../history-queries-switch.vue';
import { resetXHistoryQueriesStateWith } from './utils';

function renderHistoryQueriesSwitch(): HistoryQueriesSwitchAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, localVue);
  resetXHistoryQueriesStateWith(store, { isEnabled: false });

  const wrapper = mount(HistoryQueriesSwitch, {
    localVue,
    store
  });

  return {
    wrapper
  };
}

describe('testing HistoryQueriesSwitch component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderHistoryQueriesSwitch();

    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('should emit proper events when toggling its state', () => {
    const { wrapper } = renderHistoryQueriesSwitch();
    const enableListener = jest.fn();
    const disableListener = jest.fn();

    wrapper.vm.$x.on('UserClickedEnableHistoryQueries').subscribe(enableListener);
    wrapper.vm.$x.on('UserClickedDisableHistoryQueries').subscribe(disableListener);

    wrapper.trigger('click');

    expect(enableListener).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.x.historyQueries.isEnabled).toBe(true);

    wrapper.trigger('click');

    expect(disableListener).toHaveBeenCalledTimes(1);
  });
});

/**
 * Test API for the {@link HistoryQueriesSwitch} component.
 */
interface HistoryQueriesSwitchAPI {
  /** The wrapper for HistoryQueriesSwitch component. */
  wrapper: Wrapper<Vue>;
}
